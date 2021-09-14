import fsp from 'fs/promises';
import path from 'path';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { TranslatedPizzaWithId } from 'libs/pizza-parser/types/pizza';
import { GetPizzasDto } from './dto/getPizzas.dto';
import { Pizza } from './entities/pizza.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface SavedPizzas {
  timestamp: number;
  pizzas: TranslatedPizzaWithId[];
}

const pizzasPath = path.join(process.cwd(), 'pizzas.json');

const numberAndText = {
  type: 'integer',
  fields: {
    text: {
      type: 'text',
    },
  },
};

@Injectable()
export class PizzaService implements OnModuleInit {
  private pizzasIndexBase = 'pizzas';
  private pizzasIndex: string;

  constructor(private elasticsearchService: ElasticsearchService) {}

  public async onModuleInit() {
    await this.setPizzasIfNotExists();
  }

  private async setPizzasIfNotExists() {
    const { timestamp, pizzas } = JSON.parse(await fsp.readFile(pizzasPath, 'utf-8')) as SavedPizzas;

    this.pizzasIndex = `${this.pizzasIndexBase}-${timestamp}`;

    const { body: isExists } = await this.elasticsearchService.indices.exists({ index: this.pizzasIndex });

    if (isExists) return;

    await this.elasticsearchService.indices.create({
      index: this.pizzasIndex,
      body: {
        mappings: {
          properties: {
            id: { type: 'text' },
            image: { type: 'text' },
            link: { type: 'text' },
            lang: { type: 'text' },
            country: { type: 'text' },
            city: { type: 'text' },
            weight: numberAndText,
            size: numberAndText,
            price: numberAndText,
            uk_title: { type: 'text' },
            uk_description: { type: 'text' },
            ru_title: { type: 'text' },
            ru_description: { type: 'text' },
            en_title: { type: 'text' },
            en_description: { type: 'text' },
          },
        },
      },
    });

    const bulkBody = pizzas.flatMap((pizza) => [{ index: { _index: this.pizzasIndex } }, pizza]);
    const {
      body: { errors },
    } = await this.elasticsearchService.bulk({ refresh: true, body: bulkBody });

    if (errors.length > 0) throw new Error('bulk has errors');
  }

  private queryToSimpleQuery(query: string) {
    return query
      .split(' ')
      .map((word) => {
        const isNumber = !isNaN(parseInt(word));

        if (isNumber) return word;
        return `${word}~`;
      })
      .join(' ');
  }

  public async getPizzas({ query, limit, offset, country, city, orderBy }: GetPizzasDto) {
    const must: Record<string, unknown> = {};

    if (query.length === 0) {
      must.match_all = {};
    } else {
      must.simple_query_string = {
        query: this.queryToSimpleQuery(query),
        fields: ['*_title', '*_description', 'weight.text', 'size.text', 'price.text'],
        default_operator: 'and',
      };
    }

    const esQuery = {
      index: this.pizzasIndex,
      body: {
        from: offset,
        size: limit,
        sort: orderBy ? [{ [orderBy.target]: orderBy.cause }] : undefined,
        query: {
          bool: {
            must,
            filter: [{ term: { country } }, { term: { city } }],
          },
        },
      },
    };

    const {
      body: { hits },
    } = await this.elasticsearchService.search(esQuery);

    const total: number = hits.total.value;
    const value: TranslatedPizzaWithId[] = hits.hits.map(({ _source }) => _source);

    return { total, value };
  }

  public async getPizzasTotal() {
    const {
      body: { count },
    } = await this.elasticsearchService.count({
      index: this.pizzasIndex,
    });

    const total: number = count;

    return { total };
  }

  public async getPizzasByIds(ids: string[]) {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search({
      index: this.pizzasIndex,
      body: {
        query: {
          bool: {
            should: ids.map((id) => ({ match: { id } })),
          },
        },
      },
    });

    const value: Pizza[] = hits.map(({ _source }) => _source);

    return { value };
  }

  public async getPizzaById(id: string) {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search({
      index: this.pizzasIndex,
      body: {
        query: {
          bool: {
            must: [
              {
                match: { id },
              },
            ],
          },
        },
      },
    });

    const value: Pizza = hits.map(({ _source }) => _source)[0];

    return { value };
  }
}

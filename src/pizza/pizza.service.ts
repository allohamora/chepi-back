import { Injectable, OnModuleInit } from '@nestjs/common';
import { GetPizzasDto } from './dto/getPizzas.dto';
import { Pizza } from './entities/pizza.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { SearchQuery } from 'src/types/elasticsearch';
import { pizzas, createdAt } from 'pizzas.json';
import { PizzasStateResultDto } from './dto/pizzasState.dto';

const numberAndText = {
  type: 'integer',
  fields: {
    text: {
      type: 'text',
    },
  },
} as const;

const PIZZAS_MAPPINGS: estypes.MappingTypeMapping = {
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
};

const PIZZAS_INDEX = `pizzas-${createdAt}`;
const PIZZAS_CREATED_AT = createdAt;
const PIZZAS_COUNT = pizzas.length;

@Injectable()
export class PizzaService implements OnModuleInit {
  constructor(private elasticsearchService: ElasticsearchService) {}

  public async onModuleInit() {
    await this.setPizzasIfNotExists();
  }

  private async setPizzasIfNotExists() {
    const { body: isExists } = await this.elasticsearchService.indices.exists({ index: PIZZAS_INDEX });

    if (isExists) return;

    await this.elasticsearchService.indices.create<estypes.IndicesCreateResponse>({
      index: PIZZAS_INDEX,
      body: {
        mappings: PIZZAS_MAPPINGS,
      },
    });

    const bulkBody = pizzas.flatMap((pizza) => [{ index: { _index: PIZZAS_INDEX } }, pizza]);
    const {
      body: { errors },
    } = await this.elasticsearchService.bulk<estypes.BulkResponse>({ refresh: true, body: bulkBody });

    if (errors) throw new Error('bulk has errors');
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
    const must: estypes.QueryDslQueryContainer = {};

    if (query.length === 0) {
      must.match_all = {};
    } else {
      must.simple_query_string = {
        query: this.queryToSimpleQuery(query),
        fields: ['*_title', '*_description', 'weight.text', 'size.text', 'price.text'],
        default_operator: 'and',
      };
    }

    const esQuery: SearchQuery = {
      index: PIZZAS_INDEX,
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
    } = await this.elasticsearchService.search<estypes.SearchResponse<Pizza>>(esQuery);

    const total: number = typeof hits.total === 'number' ? hits.total : hits.total.value;
    const value = hits.hits.map(({ _source }) => _source);

    return { total, value };
  }

  public async getPizzasByIds(ids: string[]) {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search<estypes.SearchResponse<Pizza>>({
      index: PIZZAS_INDEX,
      body: {
        query: {
          bool: {
            should: ids.map((id) => ({ match: { id } })),
          },
        },
      },
    });

    const value = hits.map(({ _source }) => _source);

    return { value };
  }

  public async getPizzaById(id: string) {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search<estypes.SearchResponse<Pizza>>({
      index: PIZZAS_INDEX,
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

    const value = hits.map(({ _source }) => _source)[0];

    return { value };
  }

  public getPizzasState(): PizzasStateResultDto {
    return { createdAt: PIZZAS_CREATED_AT, count: PIZZAS_COUNT };
  }
}

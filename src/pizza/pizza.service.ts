import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FIELDS_JOIN_SYMBOL, GetPizzasDto, SORT_JOIN_SYMBOL } from './dto/get-pizzas.dto';
import { Pizza } from './entities/pizza.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { SearchQuery } from 'src/shared/types/elasticsearch.types';
import { pizzas, updatedAt } from 'pizzas.json';
import { PizzaStats } from './dto/pizza-stats.dto';

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
    weight: numberAndText,
    size: numberAndText,
    price: numberAndText,
    uk_company: { type: 'text' },
    ru_company: { type: 'text' },
    en_company: { type: 'text' },
    uk_title: { type: 'text' },
    uk_description: { type: 'text' },
    ru_title: { type: 'text' },
    ru_description: { type: 'text' },
    en_title: { type: 'text' },
    en_description: { type: 'text' },
    historyOfChanges: {
      type: 'nested',
      properties: {
        key: { type: 'text' },
        old: { type: 'text' },
        new: { type: 'text' },
        detectedAt: { type: 'integer' },
      },
    },
  },
};

const PIZZAS_INDEX = `pizzas-${updatedAt}`;
const PIZZAS_UPDATED_AT = updatedAt;
const PIZZAS_COUNT = pizzas.length;

@Injectable()
export class PizzaService implements OnModuleInit {
  constructor(private elasticsearchService: ElasticsearchService) {}

  public async onModuleInit() {
    await this.setPizzasIfNotExist();
  }

  private async setPizzasIfNotExist() {
    const { body: isExist } = await this.elasticsearchService.indices.exists({ index: PIZZAS_INDEX });

    if (isExist) return;

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

    if (errors) throw new Error('bulk pizzas insert has errors');
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

  private sortToElasticSort(sort: string) {
    const [target, direction] = sort.split(SORT_JOIN_SYMBOL);

    return [{ [target]: direction as 'asc' | 'desc' }];
  }

  private getTotalFromHits<T>(hits: estypes.SearchHitsMetadata<T>) {
    return typeof hits.total === 'number' ? hits.total : hits.total.value;
  }

  private sort(sort?: string) {
    if (!sort) {
      return undefined;
    }

    return { sort: this.sortToElasticSort(sort) };
  }

  private filterByQuery(query?: string) {
    const must: estypes.QueryDslQueryContainer = {};

    if (!query || query.trim().length === 0) {
      must.match_all = {};
    } else {
      must.simple_query_string = {
        query: this.queryToSimpleQuery(query),
        fields: ['*_title', '*_description', '*_company', 'weight.text', 'size.text', 'price.text'],
        default_operator: 'and',
      };
    }

    return { must };
  }

  private filterByPlace(country?: string, city?: string) {
    const filter: estypes.QueryDslQueryContainer[] = [];

    if (country) {
      filter.push({ term: { country } });
    }

    if (city) {
      filter.push({ term: { city } });
    }

    if (!filter.length) {
      return undefined;
    }

    return {
      filter,
    };
  }

  private filterByIds(ids?: string[]) {
    if (!ids || !ids.length) {
      return undefined;
    }

    return {
      should: ids.map((id) => ({ match: { id } })),
      minimum_should_match: 1,
    };
  }

  private selectFields(fields?: string) {
    if (!fields) {
      return undefined;
    }

    return {
      _source: fields.split(FIELDS_JOIN_SYMBOL),
    };
  }

  public async getPizzas({ limit, offset, sort, query, country, city, ids, fields }: GetPizzasDto) {
    const esQuery: SearchQuery = {
      index: PIZZAS_INDEX,
      body: {
        from: offset,
        size: limit,
        ...this.sort(sort),
        ...this.selectFields(fields),
        query: {
          bool: {
            ...this.filterByQuery(query),
            ...this.filterByPlace(country, city),
            ...this.filterByIds(ids),
          },
        },
      },
    };

    const {
      body: { hits },
    } = await this.elasticsearchService.search<estypes.SearchResponse<Pizza>>(esQuery);

    const total = this.getTotalFromHits(hits);
    const data = hits.hits.map(({ _source }) => _source);

    return { meta: { total, count: data.length }, data };
  }

  public async getPizza(id: string) {
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

    if (value === undefined) {
      throw new NotFoundException('pizza is not found');
    }

    return value;
  }

  public getPizzaStats(): PizzaStats {
    return { updatedAt: PIZZAS_UPDATED_AT, count: PIZZAS_COUNT };
  }
}

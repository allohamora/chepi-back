import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, SearchParams } from 'meilisearch';

interface SelectOptions {
  limit?: number;
  offset?: number;
  where?: string;
}

@Injectable()
export class FtsService {
  public client: MeiliSearch;

  constructor(private configService: ConfigService) {
    this.client = new MeiliSearch({
      host: this.configService.get('MEILI_URL'),
      apiKey: this.configService.get('MEILI_MASTER_KEY'),
    });
  }

  public async select(index: string, query: string, selectOptions: SelectOptions = null) {
    let options: SearchParams<unknown> = null;

    if (selectOptions) {
      const { where, limit, offset } = selectOptions;

      options = { limit, offset, filter: where };
    }

    return await this.client.index(index).search(query, options);
  }

  public async insert<T extends unknown>(index: string, documents: T[]) {
    return await this.client.index(index).addDocuments(documents);
  }

  public async delete(index: string, ids: string[] | number[]) {
    return await this.client.index(index).deleteDocuments(ids);
  }

  public async update<T extends unknown>(index: string, documents: T[]) {
    return await this.client.index(index).updateDocuments(documents);
  }
}

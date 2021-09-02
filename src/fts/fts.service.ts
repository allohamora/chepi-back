import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, SearchParams } from 'meilisearch';
import { FtsWhereBuilder } from './fts-where.builder';

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

    const { hits, nbHits } = await this.client.index(index).search(query, options);

    return { value: hits, total: nbHits };
  }

  public async getByIds(index: string, ids: string[] | number[]) {
    const builder = new FtsWhereBuilder();

    ids.forEach((id, index) => {
      if (index !== 0) {
        builder.or();
      }

      builder.equal('id', id);
    });

    const filter = builder.build();

    const { hits } = await this.client.index(index).search('', { filter, limit: ids.length });

    return hits;
  }

  public async getById<T extends unknown>(index: string, id: string | number) {
    try {
      return await this.client.index<T>(index).getDocument(id);
    } catch (error) {
      if (error?.errorCode === 'document_not_found') return null;
      throw error;
    }
  }

  public async insert<T extends unknown>(index: string, documents: T[]) {
    await this.client.index<T>(index).addDocuments(documents);
  }

  public async delete(index: string, ids: string[] | number[]) {
    await this.client.index(index).deleteDocuments(ids);
  }

  public async update<T extends unknown>(index: string, documents: T[]) {
    await this.client.index<T>(index).updateDocuments(documents);
  }

  public async totalCount(index: string) {
    const { numberOfDocuments } = await this.client.index(index).getStats();

    return { total: numberOfDocuments };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class FtsService {
  public client: MeiliSearch;

  constructor(private configService: ConfigService) {
    this.client = new MeiliSearch({
      host: this.configService.get('MEILI_URL'),
      apiKey: this.configService.get('MEILI_MASTER_KEY'),
    });
  }

  public async select(index: string, query: string, options: { limit: number; offset: number } = null) {
    return await this.client.index(index).search(query, options);
  }

  public async insert<T extends unknown>(index: string, documents: T[]) {
    return await this.client.index(index).addDocuments(documents);
  }

  public async deleteAll(index: string) {
    return await this.client.index(index).deleteAllDocuments();
  }
}

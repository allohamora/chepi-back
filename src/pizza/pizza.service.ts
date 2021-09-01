import fsp from 'fs/promises';
import path from 'path';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { FtsService } from 'src/fts/fts.service';
import { TranslatedPizza } from 'libs/pizza-parser/types/pizza';
import { delay } from 'src/utils/delay';
import { nanoid } from 'nanoid';

interface SavedPizzas {
  timestamp: number;
  pizzas: TranslatedPizza[];
}
const pizzasPath = path.join(process.cwd(), 'pizzas.json');

@Injectable()
export class PizzaService implements OnModuleInit {
  private pizzasIndex = 'pizzas';
  private pizzasTimestampIndex = 'pizzas-timestamp';

  constructor(private ftsService: FtsService) {}

  public async onModuleInit() {
    const { timestamp, pizzas } = JSON.parse(await fsp.readFile(pizzasPath, 'utf-8')) as SavedPizzas;

    const index = await this.ftsService.client.getOrCreateIndex(this.pizzasTimestampIndex);
    await index.updateFilterableAttributes(['timestamp']);

    await delay(1000);
    const { hits } = await index.search('', { filter: `timestamp = ${timestamp}` });

    if (hits.length !== 0) {
      return;
    }

    const pizzaIndex = await this.ftsService.client.getOrCreateIndex(this.pizzasIndex);

    await pizzaIndex.deleteAllDocuments();
    await delay(1000);
    await pizzaIndex.updateFilterableAttributes(['city', 'country']);
    await delay(1000);

    await pizzaIndex.addDocuments(pizzas.map((pizza) => ({ ...pizza, id: nanoid() })));
    await index.addDocuments([{ timestamp, id: nanoid() }]);
  }

  public async findPizzasByQuery(query: string) {
    return this.ftsService.select(this.pizzasIndex, query);
  }
}

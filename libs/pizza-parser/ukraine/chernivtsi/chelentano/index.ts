import { getText } from 'libs/pizza-parser/utils/http';
import { UkToIngredient } from 'libs/pizza-parser/types/ingredient';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';
import cheerio, { CheerioAPI, Element } from 'cheerio';

export class Chelentano extends ChernivtsiPizzasParser {
  private blacklist = ['піцарол', 'кальцоне', 'комбо'];
  private pageLink = 'https://chernivtsi.celentano.delivery';

  private async getPage() {
    return await getText(this.pageLink);
  }

  private getPizzasElements($: CheerioAPI) {
    const pizzasElements = $('li.product_cat-pizza')
      .toArray()
      .filter((el) => {
        const isCombo = $(el).hasClass('product_cat-combo');
        if (isCombo) return false;

        const title = $(el).find('.c-product-grid__title-link').text();

        const inBlacklist = this.blacklist.includes(title.split(' ')[0].toLowerCase());
        if (inBlacklist) return false;

        return true;
      });

    return pizzasElements;
  }

  private getDescriptionAndWeights(dirtyDescription: string) {
    const chunks = dirtyDescription.trim().split(',');
    const lastChunk = chunks.pop().split(' ');
    // remove 123g/123g trash
    const weights = lastChunk.pop();

    chunks.push(lastChunk.join(' '));
    const joined = chunks.join(',');
    const result = joined.trim().replace(/,$/, '');

    return [result, weights];
  }

  private descriptionToIngredients(description: string) {
    return description
      .toLowerCase()
      .trim()
      .replace(/( та )|( і )/g, ', ')
      .split(',')
      .map((chunk) => UkToIngredient[chunk.trim()]);
  }

  private pizzasElementsToPizzas($: CheerioAPI, pizzasElements: Element[]) {
    const metadata = pizzasElements.map((el) => {
      const pizzaCard = $(el);
      const pizzaCardLink = pizzaCard.find('.c-product-grid__title-link');
      const pizzaCardImage = pizzaCard.find('img');
      const pizzaCardDescription = pizzaCard.find('.c-product-grid__short-desc');

      const title = pizzaCardLink.text().trim();
      const link = pizzaCardLink.attr('href');
      const image = pizzaCardImage.attr('data-src');
      const [description, dirtyWeights] = this.getDescriptionAndWeights(pizzaCardDescription.text());
      const ingredients = this.descriptionToIngredients(description);

      const weights = dirtyWeights
        .replace(/г/g, '')
        .split('/')
        .map((value) => Number(value));

      const sizes = pizzaCard
        .find('.c-variation__title')
        .toArray()
        .map((el) => Number($(el).text().replace('cm', '')));

      const prices = pizzaCard
        .find('.c-variation__single-price .amount')
        .toArray()
        .map((el) => Number($(el).text().replace('₴', '')));

      const variants = weights.map((weight, i) => ({
        weight,
        size: sizes[i],
        price: prices[i],
      }));

      return { title, description, image, link, ingredients, variants };
    });

    return metadata.map((pizzaMetadata) => ({ ...pizzaMetadata, ...this.baseMetadata }));
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzasElements = this.getPizzasElements($);
    const pizzas = this.pizzasElementsToPizzas($, pizzasElements);

    return pizzas;
  }
}

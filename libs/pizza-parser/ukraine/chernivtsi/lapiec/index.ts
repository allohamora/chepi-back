import cheerio, { CheerioAPI } from 'cheerio';
import { UkToIngredient } from 'libs/pizza-parser/types/ingredient';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

export class Lapiec extends ChernivtsiPizzasParser {
  private pageLink = 'https://lapiec-pizza.cv.ua/';
  private async getPage() {
    return await getText(this.pageLink);
  }

  private getPizzas($: CheerioAPI) {
    const pizzaList = $('.row.clear-md-3.clear-lg-3.clear-sm-2');
    const pizzaElements = pizzaList.find('.col-sm-6.col-md-4 .productThumbnail').toArray();

    return pizzaElements.map((element) => {
      const infoElement = $(element).find('.productInfoWrapp');
      const linkElement = $(element).find('.productImage');

      const title = infoElement.find('.h5.as').text().trim();
      const description = infoElement.find('p').text().trim().replace(/\.$/, '');
      const link = linkElement.attr('href');
      const image = linkElement.attr('data-preview');

      const size = parseInt(linkElement.find('.size').text());
      const weight = parseInt(linkElement.find('.weight').text());
      const price = Number(infoElement.find('.productPrice > span').text().trim());
      const variants = [{ size, weight, price }];

      const ingredients = description.split(',').map((ing) => UkToIngredient[ing.trim()]);

      return { title, description, link, image, variants, ingredients, ...this.baseMetadata };
    });
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzas = this.getPizzas($);

    return pizzas;
  }
}

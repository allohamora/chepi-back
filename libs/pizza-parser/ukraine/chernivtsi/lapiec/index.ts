import cheerio, { CheerioAPI } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

export class Lapiec extends ChernivtsiPizzasParser {
  private pageLink = 'https://la.ua/chernivtsy/';
  private async getPage() {
    return await getText(this.pageLink);
  }

  private getPizzas($: CheerioAPI) {
    const pizzaList = $('#home-pizza');
    const pizzaElements = pizzaList.find('.productThumbnail').toArray();

    return pizzaElements.flatMap((element) => {
      const $pizza = $(element);
      const infoElement = $pizza.find('.productInfoWrapp');

      const title = infoElement.find('.productTitle').text().trim();
      const description = infoElement.find('p').text().trim().replace(/\.$/, '');
      const link = infoElement.find('.productTitle > a').attr('href');
      const image = $pizza.find('.productThumbnail-image > img').attr('src');

      const sizeElement = $pizza.find('.productSize-W');

      const size = parseInt(sizeElement.find('.size').text());
      const weight = parseInt(sizeElement.find('.weight').text());
      const price = Number(infoElement.find('.productPrice > span').text().trim());
      const variants = [{ size, weight, price }];

      const base = { title, description, link, image, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzas = this.getPizzas($);

    return pizzas;
  }
}

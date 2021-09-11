import cheerio, { CheerioAPI } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { lower } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

export class Dongustavo extends ChernivtsiPizzasParser {
  private pageLink = 'https://www.dongustavo.com.ua';
  private async getPage() {
    return await getText(this.pageLink);
  }

  private getPizzas($: CheerioAPI) {
    const pizzaList = $('.product-list.pizza');
    const pizzaElements = pizzaList.find('.col-sm-6.col-md-4 .product_item');

    return pizzaElements.toArray().map((pizzaElement) => {
      const title = $(pizzaElement).find('.product_item--name').text().trim();
      const description = lower($(pizzaElement).find('.product_item--descr > p').text().trim());
      const image = $(pizzaElement).find('.product-image.lazyload').attr('data-src');
      const link = $(pizzaElement).find('> a').attr('href');

      const weights = JSON.parse(pizzaElement.attribs['data-weight']) as number[];
      const prices = JSON.parse(pizzaElement.attribs['data-price']) as number[];
      const sizeElements = $(pizzaElement).find('.size_btn').toArray();
      const sizes = sizeElements.map((element) => Number(element.attribs['data-size'].replace(/-cm$/, '')));
      const variants = weights.map((weight, i) => ({ weight, price: prices[i], size: sizes[i] }));

      return { title, description, image, link, variants, ...this.baseMetadata };
    });
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzas = this.getPizzas($);

    return pizzas;
  }
}

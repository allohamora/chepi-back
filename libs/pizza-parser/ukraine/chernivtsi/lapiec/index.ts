import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://la.ua/chernivtsy/';

export class Lapiec extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private getPizzaElements($pizzaList: Cheerio<Element>) {
    return $pizzaList.find('.productThumbnail').toArray();
  }

  private getTitle($info: Cheerio<Element>) {
    return $info.find('.productTitle').text().trim();
  }

  private getDescription($info: Cheerio<Element>) {
    return $info.find('p').text().trim().replace(/\.$/, '');
  }

  private getLink($info: Cheerio<Element>) {
    return $info.find('.productTitle > a').attr('href');
  }

  private getImage($pizza: Cheerio<Element>) {
    return $pizza.find('.productThumbnail-image > img').attr('src');
  }

  private getSize($variant: Cheerio<Element>) {
    const sizeText = $variant.find('.size').text();

    return parseInt(sizeText);
  }

  private getWeight($variant: Cheerio<Element>) {
    const weightText = $variant.find('.weight').text();

    return parseInt(weightText);
  }

  private getPrice($info: Cheerio<Element>) {
    const priceText = $info.find('.productPrice > span').text().trim();

    return Number(priceText);
  }

  private getPizzas($: CheerioAPI) {
    const $pizzaList = $('#home-pizza');
    const pizzaElements = this.getPizzaElements($pizzaList);

    return pizzaElements.map((element) => {
      const $pizza = $(element);
      const $info = $pizza.find('.productInfoWrapp');

      const title = this.getTitle($info);
      const description = this.getDescription($info);
      const link = this.getLink($info);
      const image = this.getImage($pizza);

      const $variant = $pizza.find('.productSize-W');

      const size = this.getSize($variant);
      const weight = this.getWeight($variant);
      const price = this.getPrice($info);

      return {
        ...this.baseMetadata,
        title,
        description,
        link,
        image,
        size,
        weight,
        price,
      };
    });
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);

    return this.getPizzas($);
  }
}

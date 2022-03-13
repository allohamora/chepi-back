import { Cheerio, CheerioAPI, Element, load } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { capitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://www.dongustavo.com.ua';

export class Dongustavo extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private normalizeTitle(title: string) {
    const fixed = title
      .replace(/pizza/i, '')
      .replace(/піца/i, '')
      .replace(/з грушею та медом/i, 'з грушею та медом')
      .replace(/з білими грибами і трюфельною олією/i, 'з білими грибами та трюфельною олією')
      .trim();

    return capitalize(fixed);
  }

  private normalizeDescription(description: string) {
    const fixed = description
      .replace(/\s/g, ' ')
      .replace(/моцарелла/i, 'моцарела')
      .replace(/сир фета/, 'фета')
      .replace(/сир дор блю/gi, 'дорблю')
      .replace(/дор блю/, 'дорблю')
      .replace(/чері/, 'помідори чері')
      .replace(/помідори помідори чері/, 'помідори чері')
      .replace(/оливки каламата/, 'оливки "Каламата"')
      .replace(/соус цезарь/, 'соус "Цезар"')
      .replace(/^coyc, /i, '')
      .replace(/^соус, /i, '')
      .trim();

    return capitalize(fixed);
  }

  private getPizzaElements($pizzaList: Cheerio<Element>) {
    return $pizzaList.find('.col-sm-6.col-md-4 .product_item').toArray();
  }

  private getTitle($pizza: Cheerio<Element>) {
    return $pizza.find('.product_item--name').text().trim();
  }

  private getDescription($pizza: Cheerio<Element>) {
    return $pizza.find('.product_item--descr > p').text().trim().toLowerCase();
  }

  private getImage($pizza: Cheerio<Element>) {
    return $pizza.find('.product-image.lazyload').attr('data-src');
  }

  private getLink($pizza: Cheerio<Element>) {
    return $pizza.find('> a').attr('href');
  }

  private getWeights(pizzaElement: Element) {
    return JSON.parse(pizzaElement.attribs['data-weight']) as number[];
  }

  private getPrices(pizzaElement: Element) {
    return JSON.parse(pizzaElement.attribs['data-price']) as number[];
  }

  private getSizes($pizza: Cheerio<Element>) {
    const sizeElements = $pizza.find('.size_btn').toArray();

    return sizeElements.map((element) => {
      const stringSize = element.attribs['data-size'].replace(/-cm$/, '');

      return Number(stringSize);
    });
  }

  private getPizzas($: CheerioAPI) {
    const $pizzaList = $('.product-list.pizza');
    const pizzaElements = this.getPizzaElements($pizzaList);

    return pizzaElements.flatMap((pizzaElement) => {
      const $pizza = $(pizzaElement);

      const pizzaTitle = this.getTitle($pizza);
      const title = this.normalizeTitle(pizzaTitle);
      const pizzaDescription = this.getDescription($pizza);
      const description = this.normalizeDescription(pizzaDescription);
      const image = this.getImage($pizza);
      const link = this.getLink($pizza);

      const weights = this.getWeights(pizzaElement);
      const prices = this.getPrices(pizzaElement);
      const sizes = this.getSizes($pizza);
      const variants = weights.map((weight, i) => ({ weight, price: prices[i], size: sizes[i] }));

      const base = { title, description, image, link, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = load(pageHtml);

    return this.getPizzas($);
  }
}

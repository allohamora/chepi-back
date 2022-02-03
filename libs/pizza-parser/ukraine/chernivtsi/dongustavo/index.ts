import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://www.dongustavo.com.ua';

const DASH_MEASURE_SIZE_REGEXP = /-cm$/;

const PIZZA_LIST_SELECTOR = '.product-list.pizza';
const PIZZA_ELEMENT_SELECTOR = '.col-sm-6.col-md-4 .product_item';
const PIZZA_TITLE_SELECTOR = '.product_item--name';
const PIZZA_DESCRIPTION_SELECTOR = '.product_item--descr > p';
const PIZZA_SIZE_SELECTOR = '.size_btn';

const PIZZA_IMAGE_SELECTOR = '.product-image.lazyload';
const PIZZA_IMAGE_LINK_ATTR = 'data-src';

const PIZZA_ANCHOR_SELECTOR = '> a';
const PIZZA_ANCHOR_LINK_ATTR = 'href';

const PIZZA_WEIGHT_ATTR = 'data-weight';
const PIZZA_PRICE_ATTR = 'data-price';
const PIZZA_SIZE_ATTR = 'data-size';

export class Dongustavo extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private getPizzaElements(pizzaList: Cheerio<Element>) {
    return pizzaList.find(PIZZA_ELEMENT_SELECTOR).toArray();
  }

  private getTitle(pizza: Cheerio<Element>) {
    return pizza.find(PIZZA_TITLE_SELECTOR).text().trim();
  }

  private getDescription(pizza: Cheerio<Element>) {
    return pizza.find(PIZZA_DESCRIPTION_SELECTOR).text().trim().toLowerCase();
  }

  private getImage(pizza: Cheerio<Element>) {
    return pizza.find(PIZZA_IMAGE_SELECTOR).attr(PIZZA_IMAGE_LINK_ATTR);
  }

  private getLink(pizza: Cheerio<Element>) {
    return pizza.find(PIZZA_ANCHOR_SELECTOR).attr(PIZZA_ANCHOR_LINK_ATTR);
  }

  private getWeights(pizzaElement: Element) {
    return JSON.parse(pizzaElement.attribs[PIZZA_WEIGHT_ATTR]) as number[];
  }

  private getPrices(pizzaElement: Element) {
    return JSON.parse(pizzaElement.attribs[PIZZA_PRICE_ATTR]) as number[];
  }

  private getSizes(pizza: Cheerio<Element>) {
    const sizeElements = pizza.find(PIZZA_SIZE_SELECTOR).toArray();

    return sizeElements.map((element) => {
      const stringSize = element.attribs[PIZZA_SIZE_ATTR].replace(DASH_MEASURE_SIZE_REGEXP, '');

      return Number(stringSize);
    });
  }

  private getPizzas($: CheerioAPI) {
    const pizzaList = $(PIZZA_LIST_SELECTOR);
    const pizzaElements = this.getPizzaElements(pizzaList);

    return pizzaElements.flatMap((pizzaElement) => {
      const pizza = $(pizzaElement);

      const title = this.getTitle(pizza);
      const description = this.getDescription(pizza);
      const image = this.getImage(pizza);
      const link = this.getLink(pizza);

      const weights = this.getWeights(pizzaElement);
      const prices = this.getPrices(pizzaElement);
      const sizes = this.getSizes(pizza);
      const variants = weights.map((weight, i) => ({ weight, price: prices[i], size: sizes[i] }));

      const base = { title, description, image, link, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);

    return this.getPizzas($);
  }
}

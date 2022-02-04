import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://la.ua/chernivtsy/';

const LAST_DOT_REGEXP = /\.$/;

const PIZZA_LIST_SELECTOR = '#home-pizza';
const PIZZA_SELECTOR = '.productThumbnail';
const PIZZA_INFO_SELECTOR = '.productInfoWrapp';
const PIZZA_TITLE_SELECTOR = '.productTitle';
const PIZZA_DESCRIPTION_SELECTOR = 'p';
const PIZZA_VARIANT_SELECTOR = '.productSize-W';

const PIZZA_SIZE_SELECTOR = '.size';
const PIZZA_WEIGHT_SELECTOR = '.weight';
const PIZZA_PRICE_SELECTOR = '.productPrice > span';

const PIZZA_ANCHOR_SELECTOR = '.productTitle > a';
const PIZZA_ANCHOR_LINK_ATTR = 'href';

const PIZZA_IMAGE_SELECTOR = '.productThumbnail-image > img';
const PIZZA_IMAGE_LINK_ATTR = 'src';

export class Lapiec extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private getPizzaElements(pizzaList: Cheerio<Element>) {
    return pizzaList.find(PIZZA_SELECTOR).toArray();
  }

  private getTitle(info: Cheerio<Element>) {
    return info.find(PIZZA_TITLE_SELECTOR).text().trim();
  }

  private getDescription(info: Cheerio<Element>) {
    return info.find(PIZZA_DESCRIPTION_SELECTOR).text().trim().replace(LAST_DOT_REGEXP, '');
  }

  private getLink(info: Cheerio<Element>) {
    return info.find(PIZZA_ANCHOR_SELECTOR).attr(PIZZA_ANCHOR_LINK_ATTR);
  }

  private getImage(pizza: Cheerio<Element>) {
    return pizza.find(PIZZA_IMAGE_SELECTOR).attr(PIZZA_IMAGE_LINK_ATTR);
  }

  private getSize(variant: Cheerio<Element>) {
    const sizeText = variant.find(PIZZA_SIZE_SELECTOR).text();

    return parseInt(sizeText);
  }

  private getWeight(variant: Cheerio<Element>) {
    const weightText = variant.find(PIZZA_WEIGHT_SELECTOR).text();

    return parseInt(weightText);
  }

  private getPrice(info: Cheerio<Element>) {
    const priceText = info.find(PIZZA_PRICE_SELECTOR).text().trim();

    return Number(priceText);
  }

  private getPizzas($: CheerioAPI) {
    const pizzaList = $(PIZZA_LIST_SELECTOR);
    const pizzaElements = this.getPizzaElements(pizzaList);

    return pizzaElements.map((element) => {
      const pizzaElement = $(element);
      const infoElement = pizzaElement.find(PIZZA_INFO_SELECTOR);

      const title = this.getTitle(infoElement);
      const description = this.getDescription(infoElement);
      const link = this.getLink(infoElement);
      const image = this.getImage(pizzaElement);

      const variantElement = pizzaElement.find(PIZZA_VARIANT_SELECTOR);

      const size = this.getSize(variantElement);
      const weight = this.getWeight(variantElement);
      const price = this.getPrice(infoElement);

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

import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://czernowizza.com';
const BLACKLIST = ['Пиріг Осетинський'];

export class Czernowizza extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private getTitle($block: Cheerio<Element>) {
    return $block.find('.t776__title').text().trim();
  }

  private getPizzaElements($: CheerioAPI, $category: Cheerio<Element>) {
    return $category
      .find('.t776__product-full.js-product')
      .toArray()
      .map((element) => $(element))
      .filter(($element) => {
        const title = this.getTitle($element);
        const isBlacklisted = BLACKLIST.includes(title);

        return !isBlacklisted;
      });
  }

  private getPizzaDescription($pizza: Cheerio<Element>) {
    return $pizza
      .find('.t776__descr.t-descr.t-descr_xxs')
      .text()
      .trim()
      .replace(/\/$/, '')
      .replace(/ \//g, ',')
      .toLowerCase()
      .trim();
  }

  private getPizzaLink($pizza: Cheerio<Element>) {
    const id = $pizza.attr('id').replace('t776__product-', '');

    return `${BASE_URL}/#!/tproduct/227702381-${id}`;
  }

  private getPizzaImage($pizza: Cheerio<Element>) {
    return $pizza.find('.t-slds__item.t-slds__item_active .t-slds__bgimg.t-bgimg.js-product-img').attr('data-original');
  }

  private getVariants($pizza: Cheerio<Element>) {
    return $pizza
      .find('.t-product__option.js-product-option')
      .first()
      .find('.t-product__option-select.js-product-option-variants')
      .children()
      .toArray()
      .map((variant) => ({
        size: parseInt(variant.attribs['value']),
        price: parseInt(variant.attribs['data-product-variant-price']),
        weight: null,
      }));
  }

  private getPizzas($: CheerioAPI) {
    const $category = $('.t776');
    const $pizzas = this.getPizzaElements($, $category);

    return $pizzas.flatMap(($pizza) => {
      const title = this.getTitle($pizza);
      const description = this.getPizzaDescription($pizza);
      const link = this.getPizzaLink($pizza);
      const image = this.getPizzaImage($pizza);
      const variants = this.getVariants($pizza);

      const base = { title, description, link, image, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);

    return this.getPizzas($);
  }
}

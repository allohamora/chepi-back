import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://czernowizza.com';
const BLACKLIST = ['Пиріг Осетинський'];

const LAST_SLASH_REGEXP = /\/$/;
const SPACE_SLASH_REGEXP = / \//g;

const TITLE_SELECTOR = '.t776__title';
const PIZZA_CATEGORY_SELECTOR = '.t776';
const PIZZA_ELEMENT_SELECTOR = '.t776__product-full.js-product';
const PIZZA_DESCRIPTION_SELECTOR = '.t776__descr.t-descr.t-descr_xxs';
const PIZZA_OPTION_SELECTOR = '.t-product__option.js-product-option';
const PIZZA_VARIANT_SELECTOR = '.t-product__option-select.js-product-option-variants';

const PIZZA_IMAGE_SELECTOR = '.t-slds__item.t-slds__item_active .t-slds__bgimg.t-bgimg.js-product-img';
const PIZZA_IMAGE_LINK_ATTR = 'data-original';

const VARIANT_SIZE_ATTR = 'value';
const VARIANT_PRICE_ATTR = 'data-product-variant-price';

const PIZZA_ID_ATTR = 'id';
const PIZZA_ID_PREFIX = 't776__product-';

export class Czernowizza extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private getTitle(block: Cheerio<Element>) {
    return block.find(TITLE_SELECTOR).text().trim();
  }

  private getPizzaElements($: CheerioAPI, category: Cheerio<Element>) {
    return category
      .find(PIZZA_ELEMENT_SELECTOR)
      .toArray()
      .map((element) => $(element))
      .filter((element) => {
        const title = this.getTitle(element);
        const isBlacklisted = BLACKLIST.includes(title);

        return !isBlacklisted;
      });
  }

  private getPizzaDescription(pizza: Cheerio<Element>) {
    return pizza
      .find(PIZZA_DESCRIPTION_SELECTOR)
      .text()
      .trim()
      .replace(LAST_SLASH_REGEXP, '')
      .replace(SPACE_SLASH_REGEXP, ',')
      .toLowerCase()
      .trim();
  }

  private getPizzaLink(pizza: Cheerio<Element>) {
    const id = pizza.attr(PIZZA_ID_ATTR).replace(PIZZA_ID_PREFIX, '');

    return `${BASE_URL}/#!/tproduct/227702381-${id}`;
  }

  private getPizzaImage(pizza: Cheerio<Element>) {
    return pizza.find(PIZZA_IMAGE_SELECTOR).attr(PIZZA_IMAGE_LINK_ATTR);
  }

  private getVariants(pizza: Cheerio<Element>) {
    return pizza
      .find(PIZZA_OPTION_SELECTOR)
      .first()
      .find(PIZZA_VARIANT_SELECTOR)
      .children()
      .toArray()
      .map((variant) => ({
        size: parseInt(variant.attribs[VARIANT_SIZE_ATTR]),
        price: parseInt(variant.attribs[VARIANT_PRICE_ATTR]),
        weight: null,
      }));
  }

  private getPizzas($: CheerioAPI) {
    const category = $(PIZZA_CATEGORY_SELECTOR);
    const pizzaElements = this.getPizzaElements($, category);

    return pizzaElements.flatMap((pizza) => {
      const title = this.getTitle(pizza);
      const description = this.getPizzaDescription(pizza);
      const link = this.getPizzaLink(pizza);
      const image = this.getPizzaImage(pizza);
      const variants = this.getVariants(pizza);

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

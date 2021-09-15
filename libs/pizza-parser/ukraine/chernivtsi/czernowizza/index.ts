import { getText } from 'libs/pizza-parser/utils/http';
import { lower } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';
import cheerio, { CheerioAPI, Element } from 'cheerio';

export class Czernowizza extends ChernivtsiPizzasParser {
  private blackList = ['Пиріг Осетинський'];
  private pageLink = 'https://czernowizza.com';
  private async getPage() {
    return await getText(this.pageLink);
  }

  private getTitle($: CheerioAPI, element: Element) {
    return $(element).find('.t776__title').text().trim();
  }

  private getPizzas($: CheerioAPI) {
    const pizzaCategory = $('.t776');

    const pizzaElements = pizzaCategory
      .find('.t776__product-full.js-product')
      .toArray()
      .filter((element) => !this.blackList.includes(this.getTitle($, element)));

    return pizzaElements.flatMap((element) => {
      const id = $(element).attr('id').replace('t776__product-', '');

      const title = this.getTitle($, element);
      const description = lower(
        $(element).find('.t776__descr.t-descr.t-descr_xxs').text().trim().replace(/\/$/, '').replace(/ \//g, ','),
      ).trim();
      const link = `${this.pageLink}/#!/tproduct/227702381-${id}`;
      const image = $(element)
        .find('.t-slds__item.t-slds__item_active .t-slds__bgimg.t-bgimg.js-product-img')
        .attr('data-original');

      const variants = $(element)
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

import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { join } from 'libs/pizza-parser/utils/url';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://pizza-it.com/';
const PAGE_URL = join(BASE_URL, '/famiglia-grande');
const WHITELIST = [/^піца/];

export class PizzaIt extends ChernivtsiPizzasParser {
  private async getPageHtml(pageLink = PAGE_URL) {
    return await getText(pageLink);
  }

  private getPizzaElements($: CheerioAPI, $pizzaCategory: Cheerio<Element>) {
    return $pizzaCategory
      .find('.product-layout')
      .toArray()
      .filter((element) => {
        const title = $(element).find('.name').text().trim();

        return WHITELIST.some((regexp) => regexp.test(title));
      });
  }

  private getPizzaLinks($: CheerioAPI) {
    const $pizzaCategory = $('.main-products.product-grid');
    const pizzaElements = this.getPizzaElements($, $pizzaCategory);

    return pizzaElements.map((element) => {
      const $linkImage = $(element).find('.product-img.has-second-image');

      return join(BASE_URL, $linkImage.attr('href'));
    });
  }

  private getTitle($: CheerioAPI) {
    return $('#product > .title.page-title').text().trim().replace(/^піца/, '').trim();
  }

  private getDescription($: CheerioAPI) {
    return $('.product-blocks .block-content > h2')
      .first()
      .text()
      .trim()
      .replace(/Може бути пісною, або ні.$/, '')
      .replace(/\s/g, ' ')
      .replace(/ • /g, ', ')
      .replace(/Дуже Гостра!/, '')
      .replace(
        /томати Черрі та мікс Салатів, заправлені базиліковим Соусом Песто/,
        'томати Черрі, мікс Салатів заправлені базиліковим Соусом Песто',
      )
      .trim()
      .replace(/\.$/, '');
  }

  private getImage($: CheerioAPI) {
    const imageSrc = $('.product-img > img').attr('src');

    return join(BASE_URL, imageSrc);
  }

  private getPricesAndSizes($: CheerioAPI, basePrice: number) {
    return $('.form-group.product-option-radio.push-option .option-value')
      .toArray()
      .map((element) => {
        const text = $(element).text();
        const sizeMatch = text.match(/(\d+) см/g);
        const priceMatch = text.match(/\+\d+₴/gu);

        const gettedSize = sizeMatch ? sizeMatch[0] : '0';
        const gettedPrice = priceMatch ? priceMatch[0] : `0`;

        const rawSize = parseInt(gettedSize);
        const rawPrice = parseInt(gettedPrice) + basePrice;

        const size = rawSize === 0 ? null : rawSize;
        const price = rawPrice === 0 ? null : rawPrice;

        return { size, price };
      });
  }

  private getVariants($: CheerioAPI) {
    const notSaleBasePrice = parseInt($('.product-price').text());
    const saleBasePrice = parseInt($('.product-price-new').text());
    const basePrice = notSaleBasePrice || saleBasePrice;

    const pricesAndSizes = this.getPricesAndSizes($, basePrice);

    return $('.product-blocks .block-content > h2')
      .last()
      .text()
      .trim()
      .replace(/\s/g, ' ')
      .match(/\d+ г  -  \d+ см/g)
      .map((weightAndSize) => {
        const [weightString, sizeString] = weightAndSize.split(' - ');

        const weight = parseInt(weightString);
        const size = parseInt(sizeString);
        const findedPrice = pricesAndSizes.find(({ size: innerSize }) => innerSize === size);
        const price = findedPrice?.price ?? basePrice;

        return { weight, size, price };
      });
  }

  private async pageLinkToPizza(link: string) {
    const page = await this.getPageHtml(link);
    const $ = cheerio.load(page);

    const title = this.getTitle($);
    const description = this.getDescription($);
    const image = this.getImage($);

    const variants = this.getVariants($);

    const base = { title, description, link, image, ...this.baseMetadata };

    return variants.map((variant) => ({ ...base, ...variant }));
  }

  private async getPizzas(pageLinks: string[]) {
    const pageNestedPizzas = await Promise.all(pageLinks.map((link) => this.pageLinkToPizza(link)));

    return pageNestedPizzas.flat();
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);
    const pizzaLinks = this.getPizzaLinks($);

    return await this.getPizzas(pizzaLinks);
  }
}

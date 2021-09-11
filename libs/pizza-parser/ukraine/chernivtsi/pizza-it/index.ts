import { UkToIngredient } from 'libs/pizza-parser/types/ingredient';
import { getText } from 'libs/pizza-parser/utils/http';
import { lower } from 'libs/pizza-parser/utils/string';
import { join } from 'libs/pizza-parser/utils/url';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';
import cheerio, { CheerioAPI, Element } from 'cheerio';

export class PizzaIt extends ChernivtsiPizzasParser {
  private basePageLink = 'https://pizza-it.com/';
  private pageLink = join(this.basePageLink, '/famiglia-grande');
  private whitelist = [/^піца/];
  private async getPage(pageLink = this.pageLink) {
    return await getText(pageLink);
  }

  private getTitle($: CheerioAPI, element: Element) {
    return $(element).find('.name').text().trim();
  }

  private getPizzaLinks($: CheerioAPI) {
    const pizzasCategory = $('.main-products.product-grid');
    const pizzaElements = pizzasCategory
      .find('.product-layout')
      .toArray()
      .filter((element) => !!this.whitelist.find((regex) => regex.test(this.getTitle($, element))));

    return pizzaElements.map((element) => {
      const linkImage = $(element).find('.product-img.has-second-image');
      const link = join(this.basePageLink, linkImage.attr('href'));

      return link;
    });
  }

  private async getPizzas(pizzaLinks: string[]) {
    const pages = await Promise.all(pizzaLinks.map((link) => this.getPage(link)));
    return pages.map((page, i) => {
      const $ = cheerio.load(page);

      const title = $('#product > .title.page-title').text().trim().replace(/^піца/, '').trim();
      const description = $('.product-blocks .block-content > h2')
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
      const link = pizzaLinks[i];
      const image = join(this.basePageLink, $('.product-img > img').attr('src'));

      const basePrice = parseInt($('.product-price').text());
      const prices = $('.form-group.product-option-radio.push-option .option-value')
        .toArray()
        .map((element) => {
          const text = $(element).text();
          const sizeMatch = text.match(/(\d+) см/g);
          const priceMatch = text.match(/\+\d+₴/gu);

          const gettedSize = sizeMatch ? sizeMatch[0] : '0';
          const gettedPrice = priceMatch ? priceMatch[0] : `0`;

          const size = parseInt(gettedSize);
          const price = parseInt(gettedPrice + basePrice);

          return { size, price };
        });

      const variants = $('.product-blocks .block-content > h2')
        .last()
        .text()
        .trim()
        .replace(/\s/g, ' ')
        .match(/\d+ г  -  \d+ см/g)
        .map((weightAndSize) => {
          const [weightString, sizeString] = weightAndSize.split(' - ');

          const weight = parseInt(weightString);
          const size = parseInt(sizeString);
          const findedPrice = prices.find(({ size: innerSize }) => innerSize === size);
          const price = findedPrice?.price ?? basePrice;

          return { weight, size, price };
        });

      const ingredients = lower(description)
        .split(',')
        .map((ing) => UkToIngredient[ing.trim()]);

      return { title, description, link, image, variants, ingredients, ...this.baseMetadata };
    });
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzaLinks = this.getPizzaLinks($);
    const pizzas = await this.getPizzas(pizzaLinks);

    return pizzas as any;
  }
}

import { Cheerio, CheerioAPI, Element, load } from 'cheerio';
import { Company } from 'libs/pizza-parser/types/pizza';
import { getText } from 'libs/pizza-parser/utils/http';
import { capitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://la.ua/chernivtsy/';
const TITLE_BLACKLIST = [/На армію/, /Віртуальна піца/];

export class Lapiec extends ChernivtsiPizzasParser {
  private company: Company = {
    en_company: 'LA PIEC',
    ru_company: "LA П'ЄЦ",
    uk_company: "LA П'ЄЦ",
  };

  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private normalzeTitle(title: string) {
    const fixed = title.replace(/піца/i, '').trim();

    return capitalize(fixed);
  }

  private normalizeDescription(description: string) {
    const fixed = description
      .replace(/сир моцарела/, 'моцарела')
      .replace(/сир рікота/, 'рікота')
      .replace(/сир дорблю/, 'дорблю')
      .replace(/перець чилі/i, 'чилі')
      .replace(/чилі/i, 'перець чилі')
      .replace(/хрусткий /i, '')
      .replace(/ковбаса пепероні/, 'пепероні')
      .replace(/ковбаса салямі/, 'салямі')
      .replace(/куряче м'ясо/, 'курка')
      .replace(/свіжі гриби/, 'гриби')
      .replace(/"(.+?)"/, '$1')
      .replace(/соус барбекю/i, 'соус Барбекю')
      .replace(/соус бешамель/i, 'соус Бешамель')
      .replace(/соус цезар/i, 'соус Цезар')
      .trim();

    return capitalize(fixed);
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

  private getPrice($pizza: Cheerio<Element>) {
    const priceText = $pizza.find('.productPrice > span').text().trim();

    return Number(priceText);
  }

  private getPizzas($: CheerioAPI) {
    const $pizzaList = $('#home-pizza');
    const pizzaElements = this.getPizzaElements($pizzaList);

    return pizzaElements
      .filter((element) => {
        const $pizza = $(element);
        const $info = $pizza.find('.productInfoWrapp');
        const title = this.getTitle($info);

        return !TITLE_BLACKLIST.some((regexp) => regexp.test(title));
      })
      .map((element) => {
        const $pizza = $(element);
        const $info = $pizza.find('.productInfoWrapp');

        const pizzaTitle = this.getTitle($info);
        const title = this.normalzeTitle(pizzaTitle);
        const pizzaDescription = this.getDescription($info);
        const description = this.normalizeDescription(pizzaDescription);
        const link = this.getLink($info);
        const image = this.getImage($pizza);

        const $variant = $pizza.find('.productSize-W');

        const size = this.getSize($variant);
        const weight = this.getWeight($variant);
        const price = this.getPrice($pizza);

        return {
          ...this.baseMetadata,
          ...this.company,
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
    const $ = load(pageHtml);

    return this.getPizzas($);
  }
}

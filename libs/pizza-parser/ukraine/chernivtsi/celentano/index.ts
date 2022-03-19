import { Cheerio, CheerioAPI, Element, load } from 'cheerio';
import { Company } from 'libs/pizza-parser/types/pizza';
import { getText } from 'libs/pizza-parser/utils/http';
import { capitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://chernivtsi.celentano.delivery';
const TYPE_BLACKLIST = ['піцарол', 'кальцоне', 'комбо'];

const DESCRIPTION_WEIGHT_REGEXP = /,? ?(?<weights>\d+?г\/\d+?г)$/;

export class Celentano extends ChernivtsiPizzasParser {
  private company: Company = {
    en_company: 'Celentano',
    ru_company: 'Челентано',
    uk_company: 'Челентано',
  };

  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private normalizeTitle(title: string) {
    const fixed = title
      .replace(/піца ?/i, '')
      .replace(/цезаре/i, 'цезар')
      .trim();

    return capitalize(fixed);
  }

  private normalizeDescription(description: string) {
    const fixed = description
      .replace(/ ?сири/, '')
      .replace(/ ?перці/, '')
      .replace(/(.+?) (та|і) (.+?)/g, '$1, $3')
      .replace(/болгарський/, 'перець болгарський')
      .replace(/основа,?/i, '')
      .replace(/соус\(томатний\/вершковий\)/, 'соус томатний, соус вершковий')
      .replace(/моцарелла/g, 'моцарела')
      .replace(/соус Цезаре/, 'соус Цезар')
      .replace(/чілі/, 'перець чилі')
      .replace(/моцарела фреска/, 'моцарела Фреска')
      .replace(/салямі піканте/i, 'салямі Піканте')
      .replace(/мікс-салат/i, 'мікс салат')
      .replace(/домашній /i, '')
      .trim();

    return capitalize(fixed);
  }

  private getCardTitle($cardTitle: Cheerio<Element>) {
    return $cardTitle.text().trim();
  }

  private getCardLink($cardTitle: Cheerio<Element>) {
    return $cardTitle.attr('href');
  }

  private getCardImage($card: Cheerio<Element>) {
    return $card.find('img').attr('data-src');
  }

  private getDescriptionWithWeights($card: Cheerio<Element>) {
    return $card.find('.c-product-grid__short-desc').text().trim();
  }

  private getCardDescription($card: Cheerio<Element>) {
    const descriptionWithWeights = this.getDescriptionWithWeights($card);

    return descriptionWithWeights.replace(DESCRIPTION_WEIGHT_REGEXP, '');
  }

  private getCardWeights($card: Cheerio<Element>) {
    const descriptionWithWeights = this.getDescriptionWithWeights($card);
    const {
      groups: { weights: weightsString },
    } = descriptionWithWeights.match(DESCRIPTION_WEIGHT_REGEXP);

    return weightsString
      .split('/')
      .map((weightStringWithG) => weightStringWithG.replace('г', ''))
      .map((weightString) => Number(weightString));
  }

  private getCardSizes($: CheerioAPI, $card: Cheerio<Element>) {
    const sizeElements = $card.find('.c-variation__title').toArray();

    return sizeElements.map((element) => {
      const $size = $(element);
      const sizeStringWithCm = $size.text().trim();
      const sizeString = sizeStringWithCm.replace('cm', '');

      return Number(sizeString);
    });
  }

  private getCardPrices($: CheerioAPI, $card: Cheerio<Element>) {
    const priceElements = $card.find('.c-variation__single-price .amount').toArray();

    return priceElements.map((element) => {
      const $price = $(element);
      const priceStringWithGrn = $price.text();
      const priceString = priceStringWithGrn.replace('₴', '');

      return Number(priceString);
    });
  }

  private isCombo($card: Cheerio<Element>) {
    return $card.hasClass('product_cat-combo');
  }

  private isBlacklisted($card: Cheerio<Element>) {
    const title = this.getCardTitle($card);
    const [type] = title.toLowerCase().split(' ');

    return TYPE_BLACKLIST.includes(type);
  }

  private getPizzasCards($: CheerioAPI) {
    const $cards = $('li.product_cat-pizza')
      .toArray()
      .map((element) => $(element));

    return $cards.filter(($card) => {
      switch (true) {
        case this.isCombo($card):
          return false;
        case this.isBlacklisted($card):
          return false;
        default:
          return true;
      }
    });
  }

  private pizzasCardsToPizzas($: CheerioAPI, $pizzaCards: Cheerio<Element>[]) {
    return $pizzaCards.flatMap(($card) => {
      const $cardTitle = $card.find('.c-product-grid__title-link');

      const cardTitle = this.getCardTitle($cardTitle);
      const title = this.normalizeTitle(cardTitle);
      const cardDescription = this.getCardDescription($card);
      const description = this.normalizeDescription(cardDescription);
      const link = this.getCardLink($cardTitle);
      const image = this.getCardImage($card);

      const weights = this.getCardWeights($card);
      const sizes = this.getCardSizes($, $card);
      const prices = this.getCardPrices($, $card);

      const variants = weights.map((weight, i) => ({
        weight,
        size: sizes[i],
        price: prices[i],
      }));

      const base = { title, description, image, link, ...this.company, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = load(pageHtml);
    const $pizzaCards = this.getPizzasCards($);

    return this.pizzasCardsToPizzas($, $pizzaCards);
  }
}

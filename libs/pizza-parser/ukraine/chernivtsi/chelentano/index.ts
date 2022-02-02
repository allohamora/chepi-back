import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { SPACE } from 'libs/pizza-parser/utils/const';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://chernivtsi.celentano.delivery';
const TYPE_BLACKLIST = ['піцарол', 'кальцоне', 'комбо'];

const DESCRIPTION_WEIGHT_REGEXP = /,? ?(?<weights>\d+?г\/\d+?г)$/;

const MEASURE_OF_WEIGHT = 'г';
const MEASURE_OF_SIZE = 'cm';
const MEASURE_OF_PRICE = '₴';

const WEIGHT_JOIN_SYMBOL = '/';

const PIZZA_CARDS_SELECTOR = 'li.product_cat-pizza';
const COMBO_CLASS = 'product_cat-combo';

const CARD_TITLE_SELECTOR = '.c-product-grid__title-link';
const CARD_TITLE_LINK_ATTR = 'href';
const CARD_IMAGE_SELECTOR = 'img';
const CARD_IMAGE_LINK_ATTR = 'data-src';
const CARD_DESCRIPTION_SELECTOR = '.c-product-grid__short-desc';
const CARD_SIZES_SELECTOR = '.c-variation__title';
const CARD_PRICES_SELECTOR = '.c-variation__single-price .amount';

export class Chelentano extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private getCardTitle(card: Cheerio<Element>) {
    return card.find(CARD_TITLE_SELECTOR).text().trim();
  }

  private getCardLink(card: Cheerio<Element>) {
    return card.find(CARD_TITLE_SELECTOR).attr(CARD_TITLE_LINK_ATTR);
  }

  private getCardImage(card: Cheerio<Element>) {
    return card.find(CARD_IMAGE_SELECTOR).attr(CARD_IMAGE_LINK_ATTR);
  }

  private getDescriptionWithWeights(card: Cheerio<Element>) {
    return card.find(CARD_DESCRIPTION_SELECTOR).text().trim();
  }

  private getCardDescription(card: Cheerio<Element>) {
    const descriptionWithWeights = this.getDescriptionWithWeights(card);

    return descriptionWithWeights.replace(DESCRIPTION_WEIGHT_REGEXP, '');
  }

  private getCardWeights(card: Cheerio<Element>) {
    const descriptionWithWeights = this.getDescriptionWithWeights(card);
    const {
      groups: { weights: weightsString },
    } = descriptionWithWeights.match(DESCRIPTION_WEIGHT_REGEXP);

    return weightsString
      .split(WEIGHT_JOIN_SYMBOL)
      .map((weightString) => weightString.replace(MEASURE_OF_WEIGHT, ''))
      .map((weightString) => Number(weightString));
  }

  private getCardSizes($: CheerioAPI, card: Cheerio<Element>) {
    const sizeElements = card.find(CARD_SIZES_SELECTOR).toArray();

    return sizeElements.map((element) => {
      const sizeElement = $(element);
      const sizeStringWithMeasure = sizeElement.text().trim();
      const sizeString = sizeStringWithMeasure.replace(MEASURE_OF_SIZE, '');

      return Number(sizeString);
    });
  }

  private getCardPrices($: CheerioAPI, card: Cheerio<Element>) {
    const priceElements = card.find(CARD_PRICES_SELECTOR).toArray();

    return priceElements.map((element) => {
      const priceElement = $(element);
      const priceStringWithMeasure = priceElement.text();
      const priceString = priceStringWithMeasure.replace(MEASURE_OF_PRICE, '');

      return Number(priceString);
    });
  }

  private isCombo(card: Cheerio<Element>) {
    return card.hasClass(COMBO_CLASS);
  }

  private isBlacklisted(card: Cheerio<Element>) {
    const title = this.getCardTitle(card);
    const [type] = title.toLowerCase().split(SPACE);

    return TYPE_BLACKLIST.includes(type);
  }

  private getPizzasCards($: CheerioAPI) {
    const cards = $(PIZZA_CARDS_SELECTOR)
      .toArray()
      .map((element) => $(element));

    return cards.filter((card) => {
      switch (true) {
        case this.isCombo(card):
          return false;
        case this.isBlacklisted(card):
          return false;
        default:
          return true;
      }
    });
  }

  private pizzasCardsToPizzas($: CheerioAPI, pizzaCards: Cheerio<Element>[]) {
    const pizzas = pizzaCards.flatMap((card) => {
      const title = this.getCardTitle(card);
      const description = this.getCardDescription(card);
      const link = this.getCardLink(card);
      const image = this.getCardImage(card);

      const weights = this.getCardWeights(card);
      const sizes = this.getCardSizes($, card);
      const prices = this.getCardPrices($, card);

      const variants = weights.map((weight, i) => ({
        weight,
        size: sizes[i],
        price: prices[i],
      }));

      const base = { title, description, image, link, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });

    return pizzas;
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);
    const pizzaCards = this.getPizzasCards($);

    return this.pizzasCardsToPizzas($, pizzaCards);
  }
}

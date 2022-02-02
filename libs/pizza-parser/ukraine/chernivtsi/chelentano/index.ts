import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const SPACE = ' ';

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
  private baseUrl = 'https://chernivtsi.celentano.delivery';

  private async getPageHtml() {
    return await getText(this.baseUrl);
  }

  private getCardTitle(card: Cheerio<Element>) {
    const titleElement = card.find(CARD_TITLE_SELECTOR);
    const title = titleElement.text().trim();

    return title;
  }

  private getCardLink(card: Cheerio<Element>) {
    const titleElement = card.find(CARD_TITLE_SELECTOR);
    const link = titleElement.attr(CARD_TITLE_LINK_ATTR);

    return link;
  }

  private getCardImage(card: Cheerio<Element>) {
    const imageElement = card.find(CARD_IMAGE_SELECTOR);
    const link = imageElement.attr(CARD_IMAGE_LINK_ATTR);

    return link;
  }

  private getDescriptionWithWeights(card: Cheerio<Element>) {
    const descriptonElement = card.find(CARD_DESCRIPTION_SELECTOR);
    const descriptionWithWeights = descriptonElement.text().trim();

    return descriptionWithWeights;
  }

  private getCardDescription(card: Cheerio<Element>) {
    const descriptionWithWeights = this.getDescriptionWithWeights(card);
    const description = descriptionWithWeights.replace(DESCRIPTION_WEIGHT_REGEXP, '');

    return description;
  }

  private getCardWeights(card: Cheerio<Element>) {
    const descriptionWithWeights = this.getDescriptionWithWeights(card);
    const {
      groups: { weights: weightsString },
    } = descriptionWithWeights.match(DESCRIPTION_WEIGHT_REGEXP);
    const weights = weightsString
      .split(WEIGHT_JOIN_SYMBOL)
      .map((weightString) => weightString.replace(MEASURE_OF_WEIGHT, ''))
      .map((weightString) => Number(weightString));

    return weights;
  }

  private getCardSizes($: CheerioAPI, card: Cheerio<Element>) {
    const sizeElements = card.find(CARD_SIZES_SELECTOR).toArray();
    const elementToSize = (element: Element) => {
      const sizeElement = $(element);
      const sizeStringWithMeasure = sizeElement.text().trim();
      const sizeString = sizeStringWithMeasure.replace(MEASURE_OF_SIZE, '');
      const size = Number(sizeString);

      return size;
    };
    const sizes = sizeElements.map(elementToSize);

    return sizes;
  }

  private getCardPrices($: CheerioAPI, card: Cheerio<Element>) {
    const priceElements = card.find(CARD_PRICES_SELECTOR).toArray();
    const elementToPrice = (element: Element) => {
      const priceElement = $(element);
      const priceStringWithMeasure = priceElement.text();
      const priceString = priceStringWithMeasure.replace(MEASURE_OF_PRICE, '');
      const price = Number(priceString);

      return price;
    };
    const prices = priceElements.map(elementToPrice);

    return prices;
  }

  private isCombo(card: Cheerio<Element>) {
    return card.hasClass(COMBO_CLASS);
  }

  private isBlacklisted(card: Cheerio<Element>) {
    const title = this.getCardTitle(card);
    const [type] = title.toLowerCase().split(SPACE);
    const isBlacklisted = TYPE_BLACKLIST.includes(type);

    return isBlacklisted;
  }

  private getPizzasCards($: CheerioAPI) {
    const cards = $(PIZZA_CARDS_SELECTOR)
      .toArray()
      .map((element) => $(element));
    const removeNonPizzaCard = (card: Cheerio<Element>) => {
      switch (true) {
        case this.isCombo(card):
          return false;
        case this.isBlacklisted(card):
          return false;
        default:
          return true;
      }
    };
    const pizzaCards = cards.filter(removeNonPizzaCard);

    return pizzaCards;
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
    const pizzas = this.pizzasCardsToPizzas($, pizzaCards);

    return pizzas;
  }
}

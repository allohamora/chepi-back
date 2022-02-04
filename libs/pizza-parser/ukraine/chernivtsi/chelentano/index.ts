import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://chernivtsi.celentano.delivery';
const TYPE_BLACKLIST = ['піцарол', 'кальцоне', 'комбо'];

const DESCRIPTION_WEIGHT_REGEXP = /,? ?(?<weights>\d+?г\/\d+?г)$/;

export class Chelentano extends ChernivtsiPizzasParser {
  private async getPageHtml() {
    return await getText(BASE_URL);
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
    const pizzas = $pizzaCards.flatMap(($card) => {
      const $cardTitle = $('.c-product-grid__title-link');

      const title = this.getCardTitle($cardTitle);
      const description = this.getCardDescription($card);
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

      const base = { title, description, image, link, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });

    return pizzas;
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);
    const $pizzaCards = this.getPizzasCards($);

    return this.pizzasCardsToPizzas($, $pizzaCards);
  }
}

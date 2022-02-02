import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { lowerAndCapitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://appeti.com.ua';

const REPEATING_SPACES_REGEXP = /\s+/g;
const INVALID_SYMBOLS_REGEXP = /, ..$/;

const MEASURE_OF_SIZE = 'см';
const MEASURE_OF_PRICE = 'грн';

const CATEGORY_SELECTOR = 'section.catrgories-all div[index="pizza"]';
const CATEGORY_ITEM_TITLE_SELECTOR = '.title';
const CATEGORY_ITEM_TITLE_LINK_ATTR = 'href';

const CARD_SELECTOR = '#msProduct';
const CARD_TITLE_SELECTOR = '.title';
const CARD_DESCRIPTION_SELECTOR = '.content';
const CARD_IMAGE_SELECTOR = '#msGallery a';
const CARD_IMAGE_LINK_ATTR = 'href';

const VARIANT_FORM_SELECTOR = '.sizes form';
const VARIANT_SIZE_SELECTOR = '.value';
const VARIANT_PRICE_SELECTOR = '.product-price';

export class Apetti extends ChernivtsiPizzasParser {
  private async getPageHtml(pageLink: string = BASE_URL) {
    return await getText(pageLink);
  }

  private withBaseUrl(href: string) {
    return `${BASE_URL}/${href}`;
  }

  private parsePizzaCategoryLinks($: CheerioAPI, category: Cheerio<Element>) {
    return category
      .children()
      .toArray()
      .map((item) => {
        const href = $(item).find(CATEGORY_ITEM_TITLE_SELECTOR).attr(CATEGORY_ITEM_TITLE_LINK_ATTR);

        return this.withBaseUrl(href);
      });
  }

  private async getPizzaLinks($: CheerioAPI) {
    const category = $(CATEGORY_SELECTOR);

    return this.parsePizzaCategoryLinks($, category);
  }

  private getCardTitle(card: Cheerio<Element>) {
    const element = card.find(CARD_TITLE_SELECTOR);
    const text = element.text().trim();

    return lowerAndCapitalize(text);
  }

  private getCardDescription(card: Cheerio<Element>) {
    const element = card.find(CARD_DESCRIPTION_SELECTOR);
    const text = element.text().trim();

    return text.replace(REPEATING_SPACES_REGEXP, ' ').replace(INVALID_SYMBOLS_REGEXP, '');
  }

  private getCardImage(card: Cheerio<Element>) {
    return card.find(CARD_IMAGE_SELECTOR).attr(CARD_IMAGE_LINK_ATTR);
  }

  private getVariantSize(form: Cheerio<Element>) {
    const variant = form.find(VARIANT_SIZE_SELECTOR);
    const sizeWithMeasure = variant.text();
    const sizeWithoutMeasure = sizeWithMeasure.replace(MEASURE_OF_SIZE, '').trim();

    return Number(sizeWithoutMeasure);
  }

  private getVariantPrice(form: Cheerio<Element>) {
    const variant = form.find(VARIANT_PRICE_SELECTOR);
    const priceWithMeasure = variant.text();
    const priceWithoutMeasure = priceWithMeasure.replace(MEASURE_OF_PRICE, '').trim();

    return Number(priceWithoutMeasure);
  }

  private getCardVariants($: CheerioAPI, card: Cheerio<Element>) {
    const elements = card.find(VARIANT_FORM_SELECTOR).toArray();

    return elements.map((element) => {
      const form = $(element);

      const size = this.getVariantSize(form);
      const price = this.getVariantPrice(form);
      const weight = null; // doesn't have weight

      return { size, price, weight };
    });
  }

  private async parsePizzaPage(link: string) {
    const page = await this.getPageHtml(link);
    const $ = cheerio.load(page);
    const card = $(CARD_SELECTOR);

    const title = this.getCardTitle(card);
    const description = this.getCardDescription(card);
    const image = this.getCardImage(card);

    const variants = this.getCardVariants($, card);
    const base = { title, description, image, link, ...this.baseMetadata };

    return variants.map((variant) => ({ ...base, ...variant }));
  }

  private async parsePizzasFromLinks(links: string[]) {
    const linkToPizzas = async (link: string) => this.parsePizzaPage(link);
    const pizzasArrays = await Promise.all(links.map(linkToPizzas));

    return pizzasArrays.flat();
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);
    const pizzaLinks = await this.getPizzaLinks($);

    return await this.parsePizzasFromLinks(pizzaLinks);
  }
}

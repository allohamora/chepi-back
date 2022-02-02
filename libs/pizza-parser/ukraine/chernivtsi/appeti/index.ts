import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { compose } from 'libs/pizza-parser/utils/fp';
import { getText } from 'libs/pizza-parser/utils/http';
import { lowerAndCapitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const MEASURE_OF_SIZE = 'см';
const MEASURE_OF_PRICE = 'грн';

const REPEATING_SPACES_REGEXP = /\s+/g;
const INVALID_SYMBOLS_REGEXP = /, ..$/;

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
  private baseUrl = 'https://appeti.com.ua';

  private async getPageHtml(pageLink: string = this.baseUrl) {
    return await getText(pageLink);
  }

  private withBaseUrl(href: string) {
    return `${this.baseUrl}/${href}`;
  }

  private parsePizzaCategoryLinks($: CheerioAPI, category: Cheerio<Element>) {
    const items = category.children().toArray();
    const toHref = (item: Element) => $(item).find(CATEGORY_ITEM_TITLE_SELECTOR).attr(CATEGORY_ITEM_TITLE_LINK_ATTR);
    const toLink = (href: string) => this.withBaseUrl(href);
    const links = items.map((item) => toLink(toHref(item)));

    return links;
  }

  private async getPizzaLinks($: CheerioAPI) {
    const category = $(CATEGORY_SELECTOR);
    const links = this.parsePizzaCategoryLinks($, category);

    return links;
  }

  private getCardTitle(card: Cheerio<Element>) {
    const element = card.find(CARD_TITLE_SELECTOR);
    const text = element.text().trim();
    const title = lowerAndCapitalize(text);

    return title;
  }

  private fixRepeatingSpaces(string: string) {
    return string.replace(REPEATING_SPACES_REGEXP, ' ');
  }

  private fixInvalidSymbols(string: string) {
    return string.replace(INVALID_SYMBOLS_REGEXP, '');
  }

  private fixDescriptionText = compose(this.fixRepeatingSpaces, this.fixInvalidSymbols);

  private getCardDescription(card: Cheerio<Element>) {
    const element = card.find(CARD_DESCRIPTION_SELECTOR);
    const text = element.text().trim();
    const description = this.fixDescriptionText(text);

    return description;
  }

  private getCardImage(card: Cheerio<Element>) {
    const element = card.find(CARD_IMAGE_SELECTOR);
    const link = element.attr(CARD_IMAGE_LINK_ATTR);

    return link;
  }

  private getVariantSize(form: Cheerio<Element>) {
    const element = form.find(VARIANT_SIZE_SELECTOR);
    const text = element.text();
    const number = text.replace(MEASURE_OF_SIZE, '').trim();
    const size = Number(number);

    return size;
  }

  private getVariantPrice(form: Cheerio<Element>) {
    const element = form.find(VARIANT_PRICE_SELECTOR);
    const text = element.text();
    const number = text.replace(MEASURE_OF_PRICE, '').trim();
    const price = Number(number);

    return price;
  }

  private getCardVariants($: CheerioAPI, card: Cheerio<Element>) {
    const elements = card.find(VARIANT_FORM_SELECTOR).toArray();
    const variants = elements.map((element) => {
      const form = $(element);

      const size = this.getVariantSize(form);
      const price = this.getVariantPrice(form);
      const weight = null; // doesn't have weight

      return { size, price, weight };
    });

    return variants;
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
    const pizzas = variants.map((variant) => ({ ...base, ...variant }));

    return pizzas;
  }

  private async parsePizzasFromLinks(links: string[]) {
    const linkToPizzas = async (link: string) => this.parsePizzaPage(link);
    const pizzasArrays = await Promise.all(links.map(linkToPizzas));
    const pizzas = pizzasArrays.flat();

    return pizzas;
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = cheerio.load(pageHtml);
    const pizzaLinks = await this.getPizzaLinks($);
    const pizzas = await this.parsePizzasFromLinks(pizzaLinks);

    return pizzas;
  }
}

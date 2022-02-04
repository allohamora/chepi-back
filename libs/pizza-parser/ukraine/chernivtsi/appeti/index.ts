import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { lowerAndCapitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://appeti.com.ua';

export class Apetti extends ChernivtsiPizzasParser {
  private async getPageHtml(pageLink: string = BASE_URL) {
    return await getText(pageLink);
  }

  private withBaseUrl(href: string) {
    return `${BASE_URL}/${href}`;
  }

  private parsePizzaCategoryLinks($: CheerioAPI, $category: Cheerio<Element>) {
    return $category
      .children()
      .toArray()
      .map((item) => {
        const href = $(item).find('.title').attr('href');

        return this.withBaseUrl(href);
      });
  }

  private async getPizzaLinks($: CheerioAPI) {
    const category = $('section.catrgories-all div[index="pizza"]');

    return this.parsePizzaCategoryLinks($, category);
  }

  private getCardTitle($card: Cheerio<Element>) {
    const $element = $card.find('.title');
    const text = $element.text().trim();

    return lowerAndCapitalize(text);
  }

  private getCardDescription($card: Cheerio<Element>) {
    const $element = $card.find('.content');
    const text = $element.text().trim();

    return text.replace(/\s+/g, ' ').replace(/, ..$/, '');
  }

  private getCardImage($card: Cheerio<Element>) {
    return $card.find('#msGallery a').attr('href');
  }

  private getVariantSize($form: Cheerio<Element>) {
    const $variant = $form.find('.value');
    const sizeWithCM = $variant.text();
    const sizeWithoutCM = sizeWithCM.replace('см', '').trim();

    return Number(sizeWithoutCM);
  }

  private getVariantPrice($form: Cheerio<Element>) {
    const $variant = $form.find('.product-price');
    const priceWithGrn = $variant.text();
    const priceWithoutGrn = priceWithGrn.replace('грн', '').trim();

    return Number(priceWithoutGrn);
  }

  private getCardVariants($: CheerioAPI, $card: Cheerio<Element>) {
    const elements = $card.find('.sizes form').toArray();

    return elements.map((element) => {
      const $form = $(element);

      const size = this.getVariantSize($form);
      const price = this.getVariantPrice($form);
      const weight = null; // doesn't have weight

      return { size, price, weight };
    });
  }

  private async parsePizzaPage(link: string) {
    const pageHtml = await this.getPageHtml(link);
    const $ = cheerio.load(pageHtml);
    const $card = $('#msProduct');

    const title = this.getCardTitle($card);
    const description = this.getCardDescription($card);
    const image = this.getCardImage($card);

    const variants = this.getCardVariants($, $card);
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

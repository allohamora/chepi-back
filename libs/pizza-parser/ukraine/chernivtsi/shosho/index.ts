import { Cheerio, CheerioAPI, Element, load } from 'cheerio';
import { Company } from 'libs/pizza-parser/types/pizza';
import { getText } from 'libs/pizza-parser/utils/http';
import { capitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

const BASE_URL = 'https://shosho.pizza';
const PIZZA_CATEGORY_TITLE = 'Піца';

export class ShoSho extends ChernivtsiPizzasParser {
  private company: Company = {
    en_company: 'Sho Sho',
    ru_company: 'Шо Шо',
    uk_company: 'Шо Шо',
  };

  private async getPageHtml() {
    return await getText(BASE_URL);
  }

  private normalizeTitle(title: string) {
    const fixed = title.replace(/піца/i, '').trim();

    return capitalize(fixed);
  }

  private normalizeDescription(description: string) {
    const fixed = description
      .replace(/тісто, /i, '')
      .replace(/печериці свіжі/i, 'печериці')
      .trim();

    return capitalize(fixed);
  }

  private getPizzaCategory($: CheerioAPI) {
    const mainChildren = $('main.container').children().toArray();
    const category = mainChildren.find((el, index) => {
      if (index === 0) return;

      const categoryTitleContainer = $(mainChildren[index - 1]);
      const title = categoryTitleContainer.find('> span').text();

      return title === PIZZA_CATEGORY_TITLE;
    });

    if (!category) throw new Error(`Pizza row not found`);

    return category;
  }

  private getPizzaElements($: CheerioAPI, category: Element) {
    return $(category)
      .children()
      .children()
      .toArray()
      .reduce<[Element, Element][]>((state, el, index, elements) => {
        if ($(el).hasClass('prod-item')) {
          state.push([el, elements[index + 1]]);
        }

        return state;
      }, []);
  }

  private getTitle($modal: Cheerio<Element>) {
    return $modal.find('.popup-title').text();
  }

  private getDescription($modal: Cheerio<Element>) {
    const descriptionWithBugs = $modal.find('.popup-desc').text();

    return descriptionWithBugs
      .toLowerCase()
      .split(',')
      .map((word) => word.trim())
      .join(', ');
  }

  private getImage($modal: Cheerio<Element>) {
    return $modal.find('form img').attr('src');
  }

  private getWeight($input: Cheerio<Element>) {
    const weightString = $input.attr('data-description').replace(' гр.', '');

    return Number(weightString);
  }

  private getPrice($input: Cheerio<Element>) {
    const base = Number($input.attr('data-base_price'));
    const additional = Number($input.attr('data-option_price'));

    return base + additional;
  }

  private getSize($label: Cheerio<Element>) {
    const sizeString = $label.text().trim().replace(' см', '');

    return Number(sizeString);
  }

  private getVariants($: CheerioAPI, $modal: Cheerio<Element>) {
    return $modal
      .find('.popup-size label')
      .toArray()
      .map((el) => {
        const $label = $(el);
        const $input = $label.find('input');

        const weight = this.getWeight($input);
        const price = this.getPrice($input);
        const size = this.getSize($label);

        return { weight, price, size };
      });
  }

  private pizzaCategoryToPizzas($: CheerioAPI, category: Element) {
    const pizzaElements = this.getPizzaElements($, category);

    return pizzaElements.flatMap(([, modal]) => {
      const $modal = $(modal);

      const pizzaTitle = this.getTitle($modal);
      const title = this.normalizeTitle(pizzaTitle);
      const pizzaDescription = this.getDescription($modal);
      const description = this.normalizeDescription(pizzaDescription);
      const image = this.getImage($modal);

      const variants = this.getVariants($, $modal);

      const base = { title, description, image, link: BASE_URL, ...this.company, ...this.baseMetadata };

      return variants.map((variant) => ({ ...base, ...variant }));
    });
  }

  public async parsePizzas() {
    const pageHtml = await this.getPageHtml();
    const $ = load(pageHtml);
    const pizzaCategory = this.getPizzaCategory($);

    return this.pizzaCategoryToPizzas($, pizzaCategory);
  }
}

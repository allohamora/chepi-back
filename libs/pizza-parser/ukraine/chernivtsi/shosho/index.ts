import { getText } from 'libs/pizza-parser/utils/http';
import { UkToIngredient } from 'libs/pizza-parser/types/ingredient';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';
import cheerio, { CheerioAPI, Element } from 'cheerio';

const PIZZA_CATEGORY_TITLE = 'Піца';

export class ShoSho extends ChernivtsiPizzasParser {
  private pageLink = 'https://shosho.pizza';

  private async getPage() {
    return await getText(this.pageLink);
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

  private normalizeDescription(description: string) {
    return description
      .toLowerCase()
      .split(',')
      .map((ukIngredient) => ukIngredient.trim())
      .join(', ');
  }

  private descriptionToIngredients(description: string) {
    return description.split(',').map((ukIngredient) => UkToIngredient[ukIngredient.trim()]);
  }

  private pizzaCategoryToPizzas($: CheerioAPI, category: Element) {
    const items = $(category)
      .children()
      .children()
      .toArray()
      .reduce<[Element, Element][]>((state, el, index, elements) => {
        if ($(el).hasClass('prod-item')) {
          state.push([el, elements[index + 1]]);
        }

        return state;
      }, []);

    const pizzaMetadata = items.map(([, modal]) => {
      const title = $(modal).find('.popup-title').text();
      const description = this.normalizeDescription($(modal).find('.popup-desc').text());
      const image = $(modal).find('form img').attr('src');

      const variants = $(modal)
        .find('.popup-size label')
        .toArray()
        .map((el) => {
          const input = $(el).find('input');
          const weight = Number(input.attr('data-description').replace(' гр.', ''));
          const price = Number(input.attr('data-base_price')) + Number(input.attr('data-option_price'));
          const size = Number($(el).text().trim().replace(' см', ''));

          return { weight, price, size };
        });

      return { title, description, image, variants, link: this.pageLink };
    });

    const pizzas = pizzaMetadata.map((pizzaMetadata) => ({
      ...pizzaMetadata,
      ...this.baseMetadata,
      ingredients: this.descriptionToIngredients(pizzaMetadata.description),
    }));

    return pizzas;
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzaCategory = this.getPizzaCategory($);
    const pizzas = this.pizzaCategoryToPizzas($, pizzaCategory);

    return pizzas;
  }
}

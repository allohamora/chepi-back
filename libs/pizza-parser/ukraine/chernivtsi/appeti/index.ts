import cheerio, { CheerioAPI } from 'cheerio';
import { getText } from 'libs/pizza-parser/utils/http';
import { UkToIngredient } from 'libs/pizza-parser/types/ingredient';
import { lowerAndCapitalize } from 'libs/pizza-parser/utils/string';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

export class Apetti extends ChernivtsiPizzasParser {
  private pageLink = 'https://appeti.com.ua';

  private async getPage(pageLink: string = this.pageLink) {
    return await getText(pageLink);
  }

  private addPageLink(href: string) {
    return `${this.pageLink}/${href}`;
  }

  private async getPizzaLinks($: CheerioAPI) {
    const pizzaCategory = $('section.catrgories-all div[index="pizza"]');
    const pizzaLinks = pizzaCategory
      .children()
      .toArray()
      .map((el) => this.addPageLink($(el).find('.title').attr('href')));

    return pizzaLinks;
  }

  private ukIngredientsToIngredients(ukIngredients: string[]) {
    return ukIngredients.map((ukIngredient) => UkToIngredient[ukIngredient]);
  }

  private async parsePizzasFromLinks(links: string[]) {
    const pages = await Promise.all(links.map((link) => this.getPage(link)));
    const pizzas = pages.map((page, i) => {
      const $ = cheerio.load(page);
      const card = $('#msProduct');

      const title = lowerAndCapitalize(card.find('.title').text().trim());
      const description = lowerAndCapitalize(
        card.find('.content').text().trim().replace(/\s+/g, ' ').replace(/, ..$/, ''),
      );
      const ukIngredients = card
        .find('.folder_ingredient')
        .toArray()
        .map((el) => $(el).attr('data-original-title').toLowerCase());
      const ingredients = this.ukIngredientsToIngredients(ukIngredients);
      const image = this.addPageLink(card.find('#msGallery a').attr('href'));
      const link = links[i];

      const variants = card
        .find('.sizes form')
        .toArray()
        .map((formEl) => {
          const form = $(formEl);
          const size = Number(form.find('.value').text().replace('см', '').trim());
          const price = Number(form.find('.product-price').text().replace('грн', '').trim());
          const weight = 0; // doesn't have weight

          return { size, price, weight };
        });

      return { title, description, ingredients, variants, image, link, ...this.baseMetadata };
    });

    return pizzas;
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzaLinks = await this.getPizzaLinks($);
    const pizzas = await this.parsePizzasFromLinks(pizzaLinks);

    return pizzas;
  }
}

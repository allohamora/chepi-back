import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';
import { getJSON } from 'libs/pizza-parser/utils/http';
import { join } from 'libs/pizza-parser/utils/url';
import { capitalize } from 'libs/pizza-parser/utils/string';
import { Company, COMPANY_LIST } from './company-list';

enum MeasureType {
  grm = '0',
}

interface Dish {
  name: string;
  image: string;
  description: string;
  price: number;
  measure: string;
  measureType: MeasureType;
  availableToOrder: boolean;
}

interface Category {
  id: number;
  size: number;
  slug: string;
  blacklist?: RegExp[];
  remove?: RegExp[];
}

const BASE_URL = 'https://misteram.com.ua/chernivtsi';
const API_BASE_URL = 'https://misteram.com.ua/api';
const ASSET_BASE_URL = 'https://assets.misteram.com.ua';

const MAX_ITEMS_PER_COMPANY = 100;

export class Misteram extends ChernivtsiPizzasParser {
  private withBaseUrl(...slugs: string[]) {
    return join(BASE_URL, ...slugs);
  }

  private async getDishes(companyId: number, categoryId: number) {
    const url = join(
      API_BASE_URL,
      '/company',
      companyId.toString(),
      `/dishes?company_category_id=${categoryId}&limit=${MAX_ITEMS_PER_COMPANY}&offset=0&hideImages=0&lang=ua`,
    );

    return await getJSON<Dish[]>(url);
  }

  private notBlacklisted(dishName: string, blacklist?: RegExp[]) {
    if (blacklist === undefined) return true;

    const searchName = dishName.trim().toLowerCase();

    return blacklist.some((regexp) => regexp.test(searchName));
  }

  private availableToOrder(availableToOrder: boolean) {
    return availableToOrder;
  }

  private getLink(companySlug: string, categorySlug: string) {
    return this.withBaseUrl(companySlug, categorySlug);
  }

  private getImage(hash: string) {
    return `${ASSET_BASE_URL}/misteram-public/${hash}-400x0.png`;
  }

  private getWeight(measureType: MeasureType, measure: string) {
    return measureType === MeasureType.grm ? parseInt(measure) : null;
  }

  private clearString(target: string, remove: RegExp[]) {
    return remove.reduce((value, regex) => value.replace(regex, ''), target).trim();
  }

  private getTitle(dirtDishName: string, remove: RegExp[] = []) {
    const dishName = this.clearString(dirtDishName, remove);

    return capitalize(dishName);
  }

  private getDescription(dirtDishDescription: string, remove: RegExp[] = []) {
    const dishDescription = this.clearString(dirtDishDescription, remove);

    return dishDescription || ' ';
  }

  private dishToPizza(company: Company, category: Category, dish: Dish) {
    const link = this.getLink(company.slug, category.slug);
    const image = this.getImage(dish.image);
    const weight = this.getWeight(dish.measureType, dish.measure);

    const title = this.getTitle(dish.name, category.remove);
    const description = this.getDescription(dish.description, category.remove);

    return { title, description, image, link, weight, size: category.size, price: dish.price, ...this.baseMetadata };
  }

  private async getPizzasFromCategory(company: Company, category: Category) {
    const dishes = await this.getDishes(company.id, category.id);

    return dishes
      .filter((dish) => this.notBlacklisted(dish.name, category.blacklist))
      .filter((dish) => this.availableToOrder(dish.availableToOrder))
      .map((dish) => this.dishToPizza(company, category, dish));
  }

  private async getPizzasFromCompany(company: Company) {
    const companyNestedPizzas = await Promise.all(
      company.categories.flatMap((category) => this.getPizzasFromCategory(company, category)),
    );

    return companyNestedPizzas.flat();
  }

  private async getPizzasFromCompanyList() {
    const companyListNestedPizzas = await Promise.all(
      COMPANY_LIST.map((company) => this.getPizzasFromCompany(company)),
    );

    return companyListNestedPizzas.flat();
  }

  public async parsePizzas() {
    return await this.getPizzasFromCompanyList();
  }
}

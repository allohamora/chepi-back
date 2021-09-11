import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';
import { getJSON } from 'libs/pizza-parser/utils/http';
import { join } from 'libs/pizza-parser/utils/url';
import { UkToIngredient } from 'libs/pizza-parser/types/ingredient';
import { Pizza } from 'libs/pizza-parser/types/pizza';

interface Dish {
  name: string;
  image: string;
  description: string;
  price: number;
  measure: string;
  measureType: '0';
}

interface Category {
  id: number;
  size: number;
  slug: string;
  blacklist?: RegExp[];
}

export class Misteram extends ChernivtsiPizzasParser {
  private maxLimit = 100;
  private misteramLink = 'https://misteram.com.ua/chernivtsi/';
  private misteramApiLink = 'https://misteram.com.ua/api/';
  // private placeholderImage = 'https://assets.misteram.com.ua/misteram-public/4be85890821cea6dd9a7557b3c95b382-400x0.png';

  private companyList = [
    // { slug: 'pizzapark', company: 420, categories: [{ id: 4798, size: 0, slug: 'pizza' }] },
    { slug: 'panska-vtiha', company: 513, categories: [{ id: 6130, size: 0, slug: 'pizza', blacklist: [/лаваш/] }] },
    // { slug: 'lapasta', company: 3134, categories: [{ id: 38384, size: 0, slug: 'pizza' }] },
    // { slug: 'baza', company: 563, categories: [{ id: 7067, size: 50, slug: 'pizza' }, { id: 7068, size: 30, slug: 'pizza30' }] },
    // { slug: 'picantico', company: 1103, categories: [{ id: 13559, size: 50, slug: 'pizza50' }, { id: 13558, size: 35, slug: 'pizza35' }] },
    // { slug: 'thesad', company: 2096, categories: [{ id: 26669, size: 0, slug: 'pizza' }, { id: 32975, size: 50, slug: 'pizza50' }] },
    // { slug: 'monopoli', company: 803, categories: [{ id: 13020, size: 0, slug: 'pizza' }] },
    // { slug: 'kartoteka', company: 1323, categories: [{ id: 16173, size: 0, slug: 'pizza' }] },
    // { slug: 'chicheri', company: 448, categories: [{ id: 35368, size: 30, slug: 'pizza30' }] },
    // { slug: 'gorno', company: 1338, categories: [{ id: 16461, size: 30, slug: 'pizza30' }, { id: 16704, size: 50, slug: 'pizza50' }] },
    // { slug: 'bruno', company: 669, categories: [{ id: 8166, size: 0, slug: 'pizza' }] },
    // { slug: 'mamaspizza', company: 1026, categories: [{ id: 13687, size: 30, slug: 'pizza30' }, { id: 13686, size: 50, slug: 'pizza50' }] },
    // { slug: 'riposo', company: 635, categories: [{ id: 7666, size: 30, slug: 'pizza' }] },
    // { slug: 'chebonta', company: 2754, categories: [{ id: 34248, size: 50, slug: 'pizza50' }, { id: 34245, size: 35, slug: 'pizza35' }] },
    // { slug: 'terassa', company: 1124, categories: [{ id: 42425, size: 30, slug: 'pizza30' }] },
    // { slug: 'kucheri', company: 1111, categories: [{ id: 14047, size: 30, slug: 'pizza' }] },
    // { slug: 'kleopatra', company: 713, categories: [{ id: 14366, size: 0, slug: 'pizza' }] },
    // { slug: 'ciabatta', company: 1069, categories: [{ id: 13168, size: 30, slug: 'pizza' }] },
    // { slug: 'diverso', company: 3076, categories: [{ id: 37363, size: 0, slug: 'pizzaburgers', blacklist: [/бургер/] }] },
    // { slug: 'yourpizza', company: 3034, categories: [{ id: 36919, size: 20, slug: 'pizza20' }, { id: 36916, size: 30, slug: 'pizza30' }, { id: 36913, size: 50, slug: 'pizza50' }] },
    // { slug: 'familybakerypizza', company: 3022, categories: [{ id: 36766, size: 30, slug: 'pizza30' }, { id: 36850, size: 40, slug: 'pizza40' }] },
    // { slug: 'aveceasare', company: 2633, categories: [{ id: 32894, size: 30, slug: 'pizza30' }] },
    // { slug: 'pastamia', company: 2255, categories: [{ id: 28784, size: 0, slug: 'pizza' }] },
  ];

  private getBuyLink(...slugs: string[]) {
    return join(this.misteramLink, ...slugs);
  }

  private getImageLink(hash: string) {
    return `https://assets.misteram.com.ua/misteram-public/${hash}-400x0.png`;
  }

  private async getPizzasFromCategories(company: number, categories: Category[], companySlug: string) {
    const companyLink = this.getBuyLink(companySlug);

    const pizzasLists = await Promise.all(
      categories.map(async ({ id, size, slug, blacklist }) => {
        const url = join(
          this.misteramApiLink,
          '/company',
          company.toString(),
          `/dishes?company_category_id=${id}&limit=${this.maxLimit}&offset=0&hideImages=0&lang=ua`,
        );
        const parsed = await getJSON<Dish[]>(url);
        const link = join(companyLink, slug);

        const pizzaList = parsed
          .filter(({ name }) => {
            if (blacklist === undefined) return true;
            return !blacklist.find((regex) => regex.test(name.trim().toLowerCase()));
          })
          .map(({ name: title, description, image: hash, price, measure, measureType }) => {
            const image = this.getImageLink(hash);
            const weight = measureType === '0' ? parseInt(measure) : 0;

            const ingredients = description
              .toLowerCase()
              .split(',')
              .map((ing) => UkToIngredient[ing.trim()]);

            return { title, description, image, link, price, weight, size, ingredients };
          });

        return pizzaList;
      }),
    );

    const pizzas: Record<string, Pizza> = {};

    pizzasLists.forEach((list) => {
      list.forEach(({ title, price, weight, size, ...rest }) => {
        const target = pizzas[title];

        if (target) {
          target.link = companyLink;
          target.variants.push({ price, weight, size });
          target.variants.sort((a, b) => a.size - b.price);
          return;
        }

        pizzas[title] = { title, variants: [{ price, weight, size }], ...rest, ...this.baseMetadata };
      });
    });

    return Object.values(pizzas);
  }

  private async getPizzas() {
    const categoriesPizzas = await Promise.all(
      this.companyList.map(async ({ slug, company, categories }) => {
        return await this.getPizzasFromCategories(company, categories, slug);
      }),
    );

    return categoriesPizzas.flat(1);
  }

  public async parsePizzas() {
    const pizzas = await this.getPizzas();

    return pizzas;
  }
}

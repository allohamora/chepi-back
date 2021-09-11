import cheerio, { CheerioAPI } from 'cheerio';
import { Lang, Pizza } from 'libs/pizza-parser/types/pizza';
import { getText } from 'libs/pizza-parser/utils/http';
import { lowerAndCapitalize } from 'libs/pizza-parser/utils/string';
import { join } from 'libs/pizza-parser/utils/url';
import { ChernivtsiPizzasParser } from '../chernivtsi.pizza-parser';

interface Product {
  localization: { shortName: string; name: string; language: Lang }[];
  publicImageUrl: string;
  name: string;
  price: number;
  additionalProperties: {
    nutritional: {
      weight: number;
      composition: {
        value: string;
      };
    };
  };
  slug: string;
}

interface NextData {
  props: {
    pageProps: {
      initialState: {
        products: {
          products: Product[];
        };
      };
    };
  };
}

export class Monopizza extends ChernivtsiPizzasParser {
  private pageLink = 'https://chernivtsi.monopizza.com.ua';

  private async getPage() {
    return await getText(this.pageLink);
  }

  private getPizzas($: CheerioAPI): Pizza[] {
    const nextData = $('#__NEXT_DATA__').html();
    const parsed: NextData = JSON.parse(nextData);
    const { products } = parsed.props.pageProps.initialState.products;

    return products.map((product) => {
      const title = lowerAndCapitalize(product.name).trim();
      const description = lowerAndCapitalize(product.additionalProperties.nutritional.composition.value)
        .replace(/, у подарунок.+$/, '')
        .trim();
      const image = product.publicImageUrl;
      const link = join(this.pageLink, '/menu/pitsa', product.slug);

      const size = 0;
      const { weight } = product.additionalProperties.nutritional;
      const price = product.price;
      const variants = [{ size, weight, price }];

      return { title, description, image, link, variants, ...this.baseMetadata };
    });
  }

  public async parsePizzas() {
    const page = await this.getPage();
    const $ = cheerio.load(page);
    const pizzas = this.getPizzas($);

    return pizzas;
  }
}

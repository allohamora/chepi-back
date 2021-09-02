import { ApiProperty } from '@nestjs/swagger';
import { Ingredient } from 'libs/pizza-parser/types/ingredient';
import {
  City,
  County,
  Lang,
  supportedCities,
  supportedCountries,
  supportedLangs,
  TranslatedPizza,
  Variant as VariantType,
} from 'libs/pizza-parser/types/pizza';

class Variant implements VariantType {
  @ApiProperty({ description: 'pizza weight in grams' })
  weight: number;

  @ApiProperty({ description: 'pizza size in cm' })
  size: number;

  @ApiProperty({ description: 'pizza price in grn' })
  price: number;
}

export class Pizza implements TranslatedPizza {
  @ApiProperty({ description: 'pizza id what changes after new insert' })
  id: string;

  @ApiProperty({ description: 'link to pizza image' })
  image: string;

  @ApiProperty({ description: 'buy pizza link' })
  link: string;

  @ApiProperty({ enum: supportedLangs, description: 'original pizza content lang' })
  lang: Lang;

  @ApiProperty({ enum: supportedCountries, description: 'country where pizzeria located' })
  country: County;

  @ApiProperty({ enum: supportedCities, description: 'city where pizzeria locatd' })
  city: City;

  @ApiProperty({ enum: Ingredient, isArray: true, description: 'pizza ingredient list' })
  ingredients: Ingredient[];

  @ApiProperty({ type: [Variant], description: 'pizza variant list' })
  variants: VariantType[];

  @ApiProperty({ description: 'pizza title in ukrainian' })
  uk_title: string;

  @ApiProperty({ description: 'pizza description in ukranian' })
  uk_description: string;

  @ApiProperty({ description: 'pizza title in russian' })
  ru_title: string;

  @ApiProperty({ description: 'pizza description in russian' })
  ru_description: string;

  @ApiProperty({ description: 'pizza title in english' })
  en_title: string;

  @ApiProperty({ description: 'pizza description in english' })
  en_description: string;
}

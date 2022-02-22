import { ApiProperty } from '@nestjs/swagger';
import {
  City,
  Country,
  Lang,
  supportedCities,
  supportedCountries,
  supportedLangs,
  TranslatedPizzaWithId,
} from 'libs/pizza-parser/types/pizza';

export class Pizza implements TranslatedPizzaWithId {
  @ApiProperty({ description: 'pizza id what changes after new insert' })
  id: string;

  @ApiProperty({ description: 'link to pizza image' })
  image: string;

  @ApiProperty({ description: 'buy pizza link' })
  link: string;

  @ApiProperty({ enum: supportedLangs, description: 'original pizza content lang' })
  lang: Lang;

  @ApiProperty({ enum: supportedCountries, description: 'country where pizzeria located' })
  country: Country;

  @ApiProperty({ enum: supportedCities, description: 'city where pizzeria locatd' })
  city: City;

  @ApiProperty({ description: 'pizza weight in grams', nullable: true })
  weight: number | null;

  @ApiProperty({ description: 'pizza size in cm', nullable: true })
  size: number | null;

  @ApiProperty({ description: 'pizza price in grn', nullable: true })
  price: number | null;

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

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { City, County, supportedCities, supportedCountries } from 'libs/pizza-parser/types/pizza';

export class GetPizzasDto {
  @IsString()
  query: string;

  @IsEnum(supportedCities)
  city: City;

  @IsEnum(supportedCountries)
  country: County;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}

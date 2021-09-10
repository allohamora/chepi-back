import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { City, Country, supportedCities, supportedCountries } from 'libs/pizza-parser/types/pizza';
import { Pizza } from '../entities/pizza.entity';

export class GetPizzasDto {
  @ApiProperty({ description: 'search query', example: 'pizza with cheese' })
  @IsString()
  query: string;

  @ApiProperty({ enum: supportedCities })
  @IsEnum(supportedCities)
  city: City;

  @ApiProperty({ enum: supportedCountries })
  @IsEnum(supportedCountries)
  country: Country;

  @ApiProperty({ default: 20, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsNumber()
  offset?: number;
}

export class GetPizzaResultDto {
  @ApiProperty({ type: Pizza, isArray: true, description: 'pizza array' })
  value: Pizza[];

  @ApiProperty({ description: 'number of found pizzas by query' })
  total: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { City, Country, supportedCities, supportedCountries } from 'libs/pizza-parser/types/pizza';
import { Pizza } from '../entities/pizza.entity';

const supportedTargets = ['weight', 'size', 'price'] as const;
const supportedDirections = ['asc', 'desc'] as const;

class OrderBy {
  @ApiProperty({ enum: supportedTargets })
  @IsEnum(supportedTargets)
  target: typeof supportedTargets[number];

  @ApiProperty({ description: 'sort direction', enum: supportedDirections })
  @IsEnum(supportedDirections)
  direction: typeof supportedDirections[number];
}

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

  @ApiProperty({ default: null, required: false })
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => OrderBy)
  orderBy?: OrderBy;
}

export class GetPizzaResultDto {
  @ApiProperty({ type: Pizza, isArray: true, description: 'pizza array' })
  value: Pizza[];

  @ApiProperty({ description: 'number of found pizzas by query' })
  total: number;
}

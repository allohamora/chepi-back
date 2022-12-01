import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { City, Country, supportedCities, supportedCountries } from 'libs/pizza-parser/types/pizza';

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
  @IsOptional()
  query?: string;

  @ApiProperty({ enum: supportedCities })
  @IsEnum(supportedCities)
  @IsOptional()
  city?: City;

  @ApiProperty({ enum: supportedCountries })
  @IsEnum(supportedCountries)
  @IsOptional()
  country?: Country;

  @ApiProperty({ default: 20, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;

  @ApiProperty({ default: null, required: false })
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => OrderBy)
  orderBy?: OrderBy;

  @ApiProperty({ type: [String], nullable: true, description: 'pizza id array' })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (value && !Array.isArray(value)) {
      return [value];
    }

    return value;
  })
  ids?: string[];
}

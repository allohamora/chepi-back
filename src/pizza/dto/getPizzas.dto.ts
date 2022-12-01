import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { City, Country, supportedCities, supportedCountries } from 'libs/pizza-parser/types/pizza';

const SORT_REGEXP = /(weight|size|price):(asc|desc)/;
export const SORT_JOIN_SYMBOL = ':';

export class GetPizzasDto {
  @ApiProperty({ description: 'search query', example: 'pizza with cheese', required: false })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ enum: supportedCities, required: false })
  @IsEnum(supportedCities)
  @IsOptional()
  city?: City;

  @ApiProperty({ enum: supportedCountries, required: false })
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

  @ApiProperty({ example: `size${SORT_JOIN_SYMBOL}asc`, required: false })
  @Matches(SORT_REGEXP)
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiProperty({ type: [String], required: false, description: 'pizza id array' })
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

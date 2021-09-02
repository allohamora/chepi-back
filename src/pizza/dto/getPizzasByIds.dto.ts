import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { Pizza } from '../entities/pizza.entity';

export class GetPizzasByIdsDto {
  @ApiProperty({ type: [String], description: 'pizza id array' })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: string[];
}

export class GetPizzasByIdsResultDto {
  @ApiProperty({ type: [Pizza], description: 'pizza array' })
  value: Pizza[];
}

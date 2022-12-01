import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPizzaDto {
  @IsString()
  @ApiProperty({ description: 'pizza id' })
  id: string;
}

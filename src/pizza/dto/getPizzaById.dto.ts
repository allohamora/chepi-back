import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPizzaByIdDto {
  @IsString()
  @ApiProperty({ description: 'pizza id' })
  id: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Pizza } from '../entities/pizza.entity';

export class GetPizzaByIdDto {
  @IsString()
  @ApiProperty({ description: 'pizza id' })
  id: string;
}

export class GetPizzaByIdResultDto {
  @ApiProperty({ type: Pizza, nullable: true, description: 'pizza' })
  value: Pizza | null;
}

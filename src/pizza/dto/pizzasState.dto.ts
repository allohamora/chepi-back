import { ApiProperty } from '@nestjs/swagger';

export class PizzasStateResultDto {
  @ApiProperty({ description: 'pizzas creation timestamp' })
  timestamp: number;

  @ApiProperty({ description: 'pizzas count' })
  count: number;
}

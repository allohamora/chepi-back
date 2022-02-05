import { ApiProperty } from '@nestjs/swagger';

export class PizzasState {
  @ApiProperty({ description: 'pizzas creation timestamp' })
  timestamp: number;

  @ApiProperty({ description: 'pizzas count' })
  count: number;
}

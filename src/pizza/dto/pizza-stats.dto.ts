import { ApiProperty } from '@nestjs/swagger';

export class PizzaStats {
  @ApiProperty({ description: 'pizzas update timestamp' })
  updatedAt: number;

  @ApiProperty({ description: 'pizzas count' })
  count: number;
}

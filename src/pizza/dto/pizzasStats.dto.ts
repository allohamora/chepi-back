import { ApiProperty } from '@nestjs/swagger';

export class PizzasStatsResultDto {
  @ApiProperty({ description: 'pizzas update timestamp' })
  updatedAt: number;

  @ApiProperty({ description: 'pizzas count' })
  count: number;
}

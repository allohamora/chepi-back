import { ApiProperty } from '@nestjs/swagger';

export class PizzasStateResultDto {
  @ApiProperty({ description: 'pizzas update timestamp' })
  updatedAt: number;

  @ApiProperty({ description: 'pizzas count' })
  count: number;
}

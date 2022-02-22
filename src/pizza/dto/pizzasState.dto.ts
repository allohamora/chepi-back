import { ApiProperty } from '@nestjs/swagger';

export class PizzasStateResultDto {
  @ApiProperty({ description: 'pizzas creation timestamp' })
  createdAt: number;

  @ApiProperty({ description: 'pizzas count' })
  count: number;
}

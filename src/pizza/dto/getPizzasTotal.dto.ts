import { ApiProperty } from '@nestjs/swagger';

export class GetPizzasTotalResultDto {
  @ApiProperty({ description: 'total number of pizzas in db' })
  total: number;
}

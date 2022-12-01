import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiNotFoundResponse, ApiOkResponse } from 'src/shared/swagger/api-response.decorators';
import { GetPizzaDto } from './dto/get-pizza.dto';
import { GetPizzasDto } from './dto/get-pizzas.dto';
import { PizzaStats } from './dto/pizza-stats.dto';
import { Pizza } from './entities/pizza.entity';
import { PizzaService } from './pizza.service';

@ApiTags('Pizza')
@Controller('pizzas')
export class PizzaController {
  constructor(private pizzaService: PizzaService) {}

  @ApiOperation({ summary: 'Get pizzas by query' })
  @ApiOkResponse({ description: 'Return found by query params pizzas', type: Pizza, isArray: true })
  @Get('/')
  public getPizzas(@Query() getPizzasDto: GetPizzasDto) {
    return this.pizzaService.getPizzas(getPizzasDto);
  }

  @ApiOperation({ summary: 'Get pizzas.json stats' })
  @ApiOkResponse({ description: 'Return pizzas.json stats', type: PizzaStats })
  @Get('/stats')
  public getPizzaStats() {
    return this.pizzaService.getPizzaStats();
  }

  @ApiOperation({ summary: 'Get pizza by id' })
  @ApiOkResponse({ description: 'Return pizza by id', type: Pizza })
  @ApiNotFoundResponse({ description: 'Pizza is not found' })
  @Get('/:id')
  public getPizza(@Param() { id }: GetPizzaDto) {
    return this.pizzaService.getPizza(id);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiNotFoundResponse, ApiOkResponse } from 'src/shared/swagger';
import { GetPizzaByIdDto } from './dto/getPizzaById.dto';
import { GetPizzasDto } from './dto/getPizzas.dto';
import { PizzaStats } from './dto/pizzasStats.dto';
import { Pizza } from './entities/pizza.entity';
import { PizzaService } from './pizza.service';

@ApiTags('Pizza')
@Controller('pizzas')
export class PizzaController {
  constructor(private pizzaService: PizzaService) {}

  @ApiOperation({ summary: 'Get pizzas by query' })
  @ApiOkResponse({ description: 'Return found by query pizzas', type: Pizza, isArray: true })
  @Get('/')
  public getPizzasByQuery(@Query() getPizzasDto: GetPizzasDto) {
    return this.pizzaService.getPizzas(getPizzasDto);
  }

  @ApiOperation({ summary: 'Get pizzas stats' })
  @ApiOkResponse({ description: 'Return pizzas.json stats', type: PizzaStats })
  @Get('/stats')
  public getPizzaStats(): PizzaStats {
    return this.pizzaService.getPizzaStats();
  }

  @ApiOperation({ summary: 'Get pizza by id' })
  @ApiOkResponse({ description: 'Return pizza by id or null', type: Pizza })
  @ApiNotFoundResponse({ description: 'Pizza not found' })
  @Get('/:id')
  public getPizzaById(@Param() { id }: GetPizzaByIdDto) {
    return this.pizzaService.getPizzaById(id);
  }
}

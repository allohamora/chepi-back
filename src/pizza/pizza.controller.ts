import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPizzaByIdDto, GetPizzaByIdResultDto } from './dto/getPizzaById.dto';
import { GetPizzaResultDto, GetPizzasDto } from './dto/getPizzas.dto';
import { PizzasStatsResultDto } from './dto/pizzasStats.dto';
import { PizzaService } from './pizza.service';

@ApiTags('Pizza')
@Controller('pizzas')
export class PizzaController {
  constructor(private pizzaService: PizzaService) {}

  @ApiOperation({ summary: 'Get pizzas by query' })
  @ApiOkResponse({ description: 'Return found by query pizzas', type: GetPizzaResultDto })
  @Get('/')
  public getPizzasByQuery(@Query() getPizzasDto: GetPizzasDto): Promise<GetPizzaResultDto> {
    return this.pizzaService.getPizzas(getPizzasDto);
  }

  @ApiOperation({ summary: 'Get pizzas stats' })
  @ApiOkResponse({ description: 'Return pizzas.json stats', type: PizzasStatsResultDto })
  @Get('/stats')
  public getPizzasStats(): PizzasStatsResultDto {
    return this.pizzaService.getPizzasStats();
  }

  @ApiOperation({ summary: 'Get pizza ids' })
  @ApiOkResponse({ description: 'pizza ids', type: [String] })
  @Get('/ids')
  public getPizzaIds(): Promise<string[]> {
    return this.pizzaService.getPizzaIds();
  }

  @ApiOperation({ summary: 'Get pizza by id' })
  @ApiOkResponse({ description: 'Return pizza by id or null', type: GetPizzaByIdResultDto })
  @ApiNotFoundResponse({ description: 'Pizza not found' })
  @Get('/:id')
  public getPizzaById(@Param() { id }: GetPizzaByIdDto): Promise<GetPizzaByIdResultDto> {
    return this.pizzaService.getPizzaById(id);
  }
}

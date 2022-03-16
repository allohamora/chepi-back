import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPizzaByIdDto, GetPizzaByIdResultDto } from './dto/getPizzaById.dto';
import { GetPizzaResultDto, GetPizzasDto } from './dto/getPizzas.dto';
import { GetPizzasByIdsDto, GetPizzasByIdsResultDto } from './dto/getPizzasByIds.dto';
import { PizzasStatsResultDto } from './dto/pizzasStats.dto';
import { PizzaService } from './pizza.service';

@ApiTags('pizza')
@Controller('pizza')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @ApiOperation({ summary: 'Get pizzas by query' })
  @ApiOkResponse({ description: 'Return found by query pizzas', type: GetPizzaResultDto })
  @Post('/')
  @HttpCode(200)
  public async getPizzasByQuery(@Body() getPizzasDto: GetPizzasDto): Promise<GetPizzaResultDto> {
    return await this.pizzaService.getPizzas(getPizzasDto);
  }

  @ApiOperation({ summary: 'Get pizza by id' })
  @ApiOkResponse({ description: 'Return pizza by id or null', type: GetPizzaByIdResultDto })
  @ApiNotFoundResponse({ description: 'Pizza not found' })
  @Get('/')
  public async getPizzaById(@Query() { id }: GetPizzaByIdDto): Promise<GetPizzaByIdResultDto> {
    return await this.pizzaService.getPizzaById(id);
  }

  @ApiOperation({ summary: 'Get pizzas by ids' })
  @ApiOkResponse({
    description: 'Return found pizzas by ids. For not found id return nothing',
    type: GetPizzasByIdsResultDto,
  })
  @Post('/ids')
  @HttpCode(200)
  public async getPizzasByIds(@Body() { ids }: GetPizzasByIdsDto): Promise<GetPizzasByIdsResultDto> {
    return await this.pizzaService.getPizzasByIds(ids);
  }

  @ApiOperation({ summary: 'Get pizzas stats' })
  @ApiOkResponse({ description: 'Return pizzas.json stats', type: PizzasStatsResultDto })
  @Get('/stats')
  public getPizzasStats(): PizzasStatsResultDto {
    return this.pizzaService.getPizzasStats();
  }
}

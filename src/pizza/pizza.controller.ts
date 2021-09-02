import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { getOnePizzaParams } from './dto/findOne.params';
import { GetPizzasDto } from './dto/getPizzas.dto';
import { GetPizzasByIdsDto } from './dto/getPizzasByIds.dto';
import { PizzaService } from './pizza.service';

@Controller('pizza')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @Post('/')
  public async getPizzasByQuery(@Body() getPizzasDto: GetPizzasDto) {
    return await this.pizzaService.getPizzas(getPizzasDto);
  }

  @Get('/total')
  public async getPizzasTotal() {
    return await this.pizzaService.getPizzasTotal();
  }

  @Post('/ids')
  public async getPizzasByIds(@Body() { ids }: GetPizzasByIdsDto) {
    return await this.pizzaService.getPizzasByIds(ids);
  }

  @Get('/id/:id')
  public async getPizzaById(@Param() { id }: getOnePizzaParams) {
    return await this.pizzaService.getPizzaById(id);
  }
}

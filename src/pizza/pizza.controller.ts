import { Body, Controller, Post } from '@nestjs/common';
import { GetPizza } from './dto/getPizza.dto';
import { PizzaService } from './pizza.service';

@Controller('pizza')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @Post('/')
  public async getPizzasByQuery(@Body() getPizza: GetPizza) {
    return await this.pizzaService.findPizzasByQuery(getPizza.query);
  }
}

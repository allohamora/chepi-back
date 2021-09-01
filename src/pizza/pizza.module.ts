import { Module } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';
import { FtsModule } from 'src/fts/fts.module';

@Module({
  imports: [FtsModule],
  controllers: [PizzaController],
  providers: [PizzaService],
})
export class PizzaModule {}

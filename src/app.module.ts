import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PizzaModule } from './pizza/pizza.module';

@Module({
  imports: [ConfigModule.forRoot(), PizzaModule],
})
export class AppModule {}

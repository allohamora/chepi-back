import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FtsModule } from './fts/fts.module';
import { PizzaModule } from './pizza/pizza.module';

@Module({
  imports: [ConfigModule.forRoot(), FtsModule, PizzaModule],
})
export class AppModule {}

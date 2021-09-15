import { Module } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ node: configService.get('ES_URL') }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PizzaController],
  providers: [PizzaService],
})
export class PizzaModule {}

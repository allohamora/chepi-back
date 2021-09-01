import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FtsService } from './fts.service';

@Module({
  imports: [ConfigModule],
  providers: [FtsService],
  exports: [FtsService],
})
export class FtsModule {}

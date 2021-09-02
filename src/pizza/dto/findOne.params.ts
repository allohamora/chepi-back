import { IsString } from 'class-validator';

export class getOnePizzaParams {
  @IsString()
  id: string;
}

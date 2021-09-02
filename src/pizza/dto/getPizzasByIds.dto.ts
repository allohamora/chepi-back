import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class GetPizzasByIdsDto {
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: string[];
}

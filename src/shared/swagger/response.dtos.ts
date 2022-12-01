import { ApiProperty } from '@nestjs/swagger';

class ResponseMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  count: number;
}

export class SuccessResponse<Data> {
  @ApiProperty({ default: true })
  success: true;

  @ApiProperty({ type: ResponseMeta, required: false, nullable: true })
  meta?: ResponseMeta;

  data: Data;
}

export class ExceptionResponse {
  @ApiProperty({ default: false })
  success: false;

  @ApiProperty({ type: String, isArray: true })
  messages: string[];
}

import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse as OriginalApiResponse,
  ApiResponseMetadata,
  getSchemaPath,
} from '@nestjs/swagger';
import { capitalize } from 'src/utils/string';
import { ExceptionResponse, SuccessResponse } from 'src/shared/swagger/response';

type Item = { $ref: string } | { type: string };
type Data = { type: 'array'; items: Item } | Item;

export interface ApiResponseOptions extends Omit<ApiResponseMetadata, 'schema'> {
  type?: Function | string;
}

interface Schema {
  title?: string;
  allOf?: (Data | { properties: Record<string, Data> })[];
  $ref?: string;
}

const isPrimitive = (type: unknown): type is Function => {
  switch (type) {
    case String:
    case Boolean:
    case Number:
    case Object:
      return true;
    default:
      return false;
  }
};

const toPrimitive = (type: Function) => {
  switch (type) {
    case String:
      return 'string';
    case Boolean:
      return 'boolean';
    case Number:
      return 'number';
    default:
      throw new Error(`undefined primitive: ${type.name}`);
  }
};

const getItem = (type: Function | string) => {
  if (isPrimitive(type)) {
    return { type: toPrimitive(type) };
  } else if (typeof type === 'string') {
    return { type };
  }

  return { $ref: getSchemaPath(type) };
};

const getData = (type: Function | string, isArray = false) => {
  const item = getItem(type);

  if (isArray) {
    return { type: 'array', items: item };
  }

  return item;
};

const getIsOk = (status: HttpStatus | 'default' = 'default') => {
  return status === 'default' || status < 400;
};

const isModel = (type: string | Function): type is Function => {
  return typeof type === 'string' ? false : !isPrimitive(type);
};

export const ApiResponse = ({ isArray, type, ...options }: ApiResponseOptions = {}) => {
  let schema: Schema;

  const isOk = getIsOk(options.status);
  const response = isOk ? SuccessResponse : ExceptionResponse;

  const extraModels: Function[] = [response];

  if (type) {
    const name = typeof type === 'string' ? type : type.name;
    const data = getData(type, isArray);
    const title = isOk ? `ResponseOf${capitalize(name)}` : response.name;

    if (isModel(type)) {
      extraModels.push(type);
    }

    schema = {
      title,
      allOf: [{ $ref: getSchemaPath(response) }, { properties: { data } }],
    };
  } else {
    schema = { $ref: getSchemaPath(response) };
  }

  return applyDecorators(ApiExtraModels(...extraModels), OriginalApiResponse({ ...options, schema }));
};

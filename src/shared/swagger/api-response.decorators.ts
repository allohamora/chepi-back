import { HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from './api-response.decorator';

export const ApiOkResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.OK,
  });
};

export const ApiCreatedResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.CREATED,
  });
};

export const ApiAcceptedResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.ACCEPTED,
  });
};

export const ApiNoContentResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.NO_CONTENT,
  });
};

export const ApiMovedPermanentlyResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.MOVED_PERMANENTLY,
  });
};

export const ApiFoundResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.FOUND,
  });
};

export const ApiBadRequestResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.BAD_REQUEST,
  });
};

export const ApiUnauthorizedResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.UNAUTHORIZED,
  });
};

export const ApiTooManyRequestsResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.TOO_MANY_REQUESTS,
  });
};

export const ApiNotFoundResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.NOT_FOUND,
  });
};

export const ApiInternalServerErrorResponse = (options: ApiResponseOptions = {}) =>
  ApiResponse({
    ...options,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  });

export const ApiBadGatewayResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.BAD_GATEWAY,
  });
};

export const ApiConflictResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.CONFLICT,
  });
};

export const ApiForbiddenResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.FORBIDDEN,
  });
};

export const ApiGatewayTimeoutResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.GATEWAY_TIMEOUT,
  });
};

export const ApiGoneResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.GONE,
  });
};

export const ApiMethodNotAllowedResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.METHOD_NOT_ALLOWED,
  });
};

export const ApiNotAcceptableResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.NOT_ACCEPTABLE,
  });
};

export const ApiNotImplementedResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.NOT_IMPLEMENTED,
  });
};

export const ApiPreconditionFailedResponse = (options: ApiResponseOptions = {}) =>
  ApiResponse({
    ...options,
    status: HttpStatus.PRECONDITION_FAILED,
  });

export const ApiPayloadTooLargeResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.PAYLOAD_TOO_LARGE,
  });
};

export const ApiRequestTimeoutResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.REQUEST_TIMEOUT,
  });
};

export const ApiServiceUnavailableResponse = (options: ApiResponseOptions = {}) =>
  ApiResponse({
    ...options,
    status: HttpStatus.SERVICE_UNAVAILABLE,
  });

export const ApiUnprocessableEntityResponse = (options: ApiResponseOptions = {}) =>
  ApiResponse({
    ...options,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  });

export const ApiUnsupportedMediaTypeResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  });
};

export const ApiDefaultResponse = (options: ApiResponseOptions = {}) => {
  return ApiResponse({
    ...options,
    status: 'default',
  });
};

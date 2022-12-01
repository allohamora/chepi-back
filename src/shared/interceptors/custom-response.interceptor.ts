import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class CustomResponseInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((res) => {
        const base = { success: true };

        if ('data' in res) {
          const { data, ...rest } = res;

          return { ...base, data, ...rest };
        }

        return { ...base, data: res };
      }),
    );
  }
}

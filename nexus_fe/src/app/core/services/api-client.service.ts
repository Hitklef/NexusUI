import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiCallResult, HttpMethod } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);

  async execute<TResponse = unknown>(
    method: HttpMethod,
    path: string,
    body?: unknown
  ): Promise<ApiCallResult<TResponse>> {
    const url = path.startsWith('/') ? path : `/${path}`;
    const startedAt = performance.now();

    try {
      const response = await firstValueFrom(
        this.http.request<TResponse>(method, url, {
          body,
          observe: 'response'
        })
      );

      return {
        ok: true,
        status: response.status,
        body: response.body ?? null,
        method,
        url,
        durationMs: Math.round(performance.now() - startedAt)
      };
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        return {
          ok: false,
          status: error.status || 0,
          body: (error.error ?? null) as TResponse | null,
          method,
          url,
          durationMs: Math.round(performance.now() - startedAt),
          errorMessage: error.message
        };
      }

      throw error;
    }
  }
}

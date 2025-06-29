import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ApiError } from '@/types/api';

// API レスポンスの成功パターン
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status },
  );
}

// API レスポンスのエラーパターン
export function createErrorResponse(
  error: string,
  message?: string,
  status: number = 400,
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
      statusCode: status,
    },
    { status },
  );
}

// バリデーションエラー
export function createValidationError(message: string): NextResponse<ApiError> {
  return createErrorResponse('VALIDATION_ERROR', message, 400);
}

// 認証エラー
export function createAuthError(message?: string): NextResponse<ApiError> {
  return createErrorResponse('AUTHENTICATION_ERROR', message || '認証が必要です', 401);
}

// 未認証エラー（エイリアス）
export function createUnauthorizedError(message?: string): NextResponse<ApiError> {
  return createAuthError(message);
}

// 認可エラー
export function createAuthorizationError(message?: string): NextResponse<ApiError> {
  return createErrorResponse(
    'AUTHORIZATION_ERROR',
    message || 'この操作を実行する権限がありません',
    403,
  );
}

// リソースが見つからないエラー
export function createNotFoundError(resource?: string): NextResponse<ApiError> {
  return createErrorResponse(
    'NOT_FOUND',
    resource ? `${resource}が見つかりません` : 'リソースが見つかりません',
    404,
  );
}

// サーバーエラー
export function createServerError(message?: string): NextResponse<ApiError> {
  return createErrorResponse(
    'INTERNAL_SERVER_ERROR',
    message || 'サーバーエラーが発生しました',
    500,
  );
}

// メソッドが許可されていないエラー
export function createMethodNotAllowedError(allowedMethods: string[]): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: `許可されているメソッド: ${allowedMethods.join(', ')}`,
      statusCode: 405,
    },
    {
      status: 405,
      headers: {
        Allow: allowedMethods.join(', '),
      },
    },
  );
}

// リクエストボディのパース
export async function parseRequestBody<T = unknown>(request: NextRequest): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

// クエリパラメータの取得
export function getQueryParams(request: NextRequest): URLSearchParams {
  const { searchParams } = new URL(request.url);
  return searchParams;
}

// ページネーション用のパラメータ取得
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// エラーハンドリング用のtry-catchラッパー
export function withErrorHandling<T extends unknown[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R | NextResponse<ApiError>> => {
    try {
      return await handler(...args);
    } catch (apiError) {
      console.error('API Error:', apiError);

      if (apiError instanceof Error) {
        // 既知のエラータイプの処理
        if (apiError.message.includes('Invalid JSON')) {
          return createValidationError('リクエストボディの形式が正しくありません');
        }
        if (apiError.message.includes('Unique constraint')) {
          return createValidationError('既に存在するデータです');
        }
        if (apiError.message.includes('Foreign key constraint')) {
          return createValidationError('関連するデータが存在しません');
        }
        if (apiError.message.includes('Record to update not found')) {
          return createNotFoundError();
        }

        return createServerError(apiError.message);
      }

      return createServerError();
    }
  };
}

// バリデーション用ヘルパー
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName}は必須です`);
  }
}

export function validateString(
  value: unknown,
  fieldName: string,
  minLength?: number,
  maxLength?: number,
): void {
  validateRequired(value, fieldName);

  if (typeof value !== 'string') {
    throw new Error(`${fieldName}は文字列である必要があります`);
  }

  if (minLength && value.length < minLength) {
    throw new Error(`${fieldName}は${minLength}文字以上である必要があります`);
  }

  if (maxLength && value.length > maxLength) {
    throw new Error(`${fieldName}は${maxLength}文字以下である必要があります`);
  }
}

export function validateArray(value: unknown, fieldName: string, minLength?: number): void {
  validateRequired(value, fieldName);

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName}は配列である必要があります`);
  }

  if (minLength && value.length < minLength) {
    throw new Error(`${fieldName}は${minLength}個以上の要素が必要です`);
  }
}

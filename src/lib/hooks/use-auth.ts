import useSWR from 'swr';
import { toast } from 'sonner';
import { fetcher } from '../swr-config';

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface AuthResponse {
  data: {
    user: User;
  };
}

// 認証状態を管理するフック
export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<AuthResponse>('/api/auth/me', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const user = data?.data?.user || null;
  const isAuthenticated = !!user;

  // ログイン関数
  const login = async (userName: string, avatar?: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, avatar }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ログインに失敗しました');
      }

      const result = await response.json();

      // SWRのキャッシュを更新
      mutate(result, false);

      toast.success('ログインしました');
      return result.data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'ログインに失敗しました');
      throw error;
    }
  };

  // ログアウト関数
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('ログアウトに失敗しました');
      }

      // SWRのキャッシュをクリア
      mutate(undefined, false);

      toast.success('ログアウトしました');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('ログアウトに失敗しました');
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isError: !!error,
    error,
    login,
    logout,
    mutate,
  };
}

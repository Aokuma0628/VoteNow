'use client';

import { useState } from 'react';
import { LogIn, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-auth';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) return;

    setIsLoading(true);
    try {
      await login(userName.trim());
      onOpenChange(false);
      setUserName('');
    } catch {
      // エラーはuseAuthのlogin関数内で処理済み
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (name: string) => {
    setIsLoading(true);
    try {
      await login(name);
      onOpenChange(false);
    } catch {
      // エラーはuseAuthのlogin関数内で処理済み
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-blue-100 border border-blue-200 mx-auto">
            <LogIn className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">ログイン</DialogTitle>
          <DialogDescription className="text-center">
            ユーザー名を入力してログインしてください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">ユーザー名</Label>
            <Input
              id="userName"
              placeholder="田中太郎"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>クイックログイン</Label>
            <div className="grid grid-cols-3 gap-2">
              {['ゲスト1', 'ゲスト2', 'ゲスト3'].map(name => (
                <Button
                  key={name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin(name)}
                  disabled={isLoading}
                  className="h-auto py-2 px-2"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || !userName.trim()}>
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

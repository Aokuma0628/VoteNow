'use client';

import * as React from 'react';
import { Share2, Twitter, Facebook, Link2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ShareMenuProps {
  title: string;
  description?: string;
  url?: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareMenu({
  title,
  description = '投票に参加してください！',
  url,
  variant = 'outline',
  size = 'icon',
}: ShareMenuProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${title} - ${description}`;

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        // ユーザーがキャンセルした場合は何もしない
        if ((error as Error).name !== 'AbortError') {
          console.error('共有に失敗しました:', error);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('リンクをコピーしました');
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error);
      toast.error('コピーに失敗しました');
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleMailShare = () => {
    const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(mailUrl);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          aria-label="投票を共有"
          className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Share2 className="h-4 w-4" />
          {size !== 'icon' && <span className="ml-2">共有</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* ネイティブ共有 */}
        {typeof window !== 'undefined' && 'share' in navigator && (
          <>
            <DropdownMenuItem
              onClick={handleNativeShare}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              共有...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* リンクコピー */}
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Link2 className="h-4 w-4" />
          リンクをコピー
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* SNS共有 */}
        <DropdownMenuItem
          onClick={handleTwitterShare}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Twitter className="h-4 w-4" />
          Twitterで共有
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleFacebookShare}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Facebook className="h-4 w-4" />
          Facebookで共有
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleMailShare}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Mail className="h-4 w-4" />
          メールで送信
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

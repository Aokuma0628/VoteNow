'use client';

import * as React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShareMenu } from '@/components/share-menu';
import { toast } from 'sonner';
import type { PollOptionWithVotes } from '@/types/api';

interface ResultShareProps {
  title: string;
  description?: string;
  options: PollOptionWithVotes[];
  totalVotes: number;
}

export function ResultShare({ title, description, options, totalVotes }: ResultShareProps) {
  const formatResultsText = () => {
    const sortedOptions = [...options].sort((a, b) => b._count.votes - a._count.votes);

    let resultText = `📊 ${title}\n`;
    if (description) {
      resultText += `${description}\n`;
    }
    resultText += `\n総投票数: ${totalVotes}票\n\n`;

    if (totalVotes === 0) {
      resultText += 'まだ投票がありません。\n';
    } else {
      resultText += '📈 結果:\n';
      sortedOptions.forEach((option, index) => {
        const percentage =
          totalVotes > 0 ? ((option._count.votes / totalVotes) * 100).toFixed(1) : '0.0';
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        resultText += `${medal} ${option.text}: ${option._count.votes}票 (${percentage}%)\n`;
      });
    }

    resultText += `\n投票はこちら: ${typeof window !== 'undefined' ? window.location.href : ''}`;
    return resultText;
  };

  const handleCopyResults = async () => {
    try {
      const resultText = formatResultsText();
      await navigator.clipboard.writeText(resultText);
      toast.success('投票結果をコピーしました');
    } catch (error) {
      console.error('コピーに失敗しました:', error);
      toast.error('コピーに失敗しました');
    }
  };

  const handleDownloadResults = () => {
    const resultText = formatResultsText();
    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^\w\s-]/g, '')}_結果.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('結果をダウンロードしました');
  };

  const shareDescription =
    totalVotes > 0
      ? `${options.length}つの選択肢で${totalVotes}票の投票結果をご覧ください！`
      : '投票に参加してください！';

  return (
    <div className="flex items-center gap-2">
      {/* 通常の共有メニュー */}
      <ShareMenu title={title} description={shareDescription} variant="outline" size="sm" />

      {/* 結果共有メニュー */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label="投票結果を共有・ダウンロード"
            className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <FileText className="h-4 w-4 mr-2" />
            結果を共有
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleCopyResults}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            結果をコピー
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDownloadResults}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            テキストでダウンロード
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

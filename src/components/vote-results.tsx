'use client';

import { CheckCircle, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoteOption } from '@/types/vote';
import { VoteUtils } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Chart.jsの登録
ChartJS.register(ArcElement, Tooltip, Legend);

interface VoteResultsProps {
  options: VoteOption[];
  totalVotes: number;
  userSelectedOptions?: string[];
  allowMultiple?: boolean;
}

interface ResultBarProps {
  option: VoteOption;
  totalVotes: number;
  isWinner: boolean;
  isUserSelection: boolean;
  rank: number;
}

function ResultBar({ option, totalVotes, isWinner, isUserSelection, rank }: ResultBarProps) {
  const percentage = VoteUtils.getVotePercentage(option, totalVotes);
  
  // 順位に応じた色を決定
  const getBarColorClass = () => {
    if (isWinner) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (rank === 2) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (rank === 3) return 'bg-gradient-to-r from-purple-500 to-purple-600';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  };
  
  return (
    <div className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-stone-800 dark:text-stone-200">
          {option.text}
          {isUserSelection && (
            <CheckCircle className="inline-block h-4 w-4 text-emerald-600 ml-2" />
          )}
        </span>
        <div className="text-right">
          <span className="font-semibold text-stone-800 dark:text-stone-200">{option.votes}票</span>
          <span className="text-sm text-stone-500 dark:text-stone-400 ml-1">({percentage}%)</span>
        </div>
      </div>
      <div className="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-700 ease-out',
            getBarColorClass()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {option.description && (
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">{option.description}</p>
      )}
    </div>
  );
}

export function VoteResults({ options, totalVotes, userSelectedOptions = [], allowMultiple }: VoteResultsProps) {
  // 投票数でソート
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);
  
  // 最高票を獲得したオプションを特定
  const maxVotes = Math.max(...options.map(opt => opt.votes));
  
  // チャートデータの準備
  const chartData = {
    labels: sortedOptions.map(opt => opt.text),
    datasets: [{
      data: sortedOptions.map(opt => opt.votes),
      backgroundColor: [
        '#10b981', // green-500
        '#3b82f6', // blue-500  
        '#8b5cf6', // purple-500
        '#f59e0b', // amber-500
        '#ef4444', // red-500
        '#6b7280', // gray-500
        '#ec4899', // pink-500
        '#14b8a6', // teal-500
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const percentage = VoteUtils.getVotePercentage({ votes: context.raw } as VoteOption, totalVotes);
            return `${context.label}: ${context.raw}票 (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <div className="space-y-6">
      {/* チャート表示 */}
      <div className="mb-8">
        <div className="h-64">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 詳細結果リスト */}
      <div className="space-y-4">
        {sortedOptions.map((option, index) => (
          <ResultBar
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            isWinner={option.votes === maxVotes && option.votes > 0}
            isUserSelection={userSelectedOptions.includes(option.id)}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
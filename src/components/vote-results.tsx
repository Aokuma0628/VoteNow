'use client';

import { CheckCircle } from 'lucide-react';
import { VoteOption } from '@/types/vote';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

interface VoteResultsProps {
  options: VoteOption[];
  totalVotes: number;
  userSelectedOptions?: string[];
  _allowMultiple?: boolean;
}

interface ResultBarProps {
  option: VoteOption;
  totalVotes: number;
  isWinner: boolean;
  isUserSelection: boolean;
  rank: number;
}

function ResultBar({ option, totalVotes, isWinner, isUserSelection, rank }: ResultBarProps) {
  const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : '0.0';

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
            getBarColorClass(),
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

// グラフの色パレット
const COLORS = [
  '#10B981', // emerald-500
  '#3B82F6', // blue-500
  '#8B5CF6', // violet-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
  '#EC4899', // pink-500
  '#6B7280', // gray-500
];

export function VoteResults({
  options,
  totalVotes,
  userSelectedOptions = [],
  _allowMultiple,
}: VoteResultsProps) {
  // 投票数でソート
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);

  // 最高票を獲得したオプションを特定
  const maxVotes = Math.max(...options.map(opt => opt.votes));

  // Recharts用のチャートデータを準備
  const chartData = useMemo(() => {
    return sortedOptions.map((option, index) => ({
      name: option.text,
      value: option.votes,
      color: COLORS[index % COLORS.length],
      percentage: totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : '0.0',
    }));
  }, [sortedOptions, totalVotes]);

  // カスタムツールチップ
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string; value: number; percentage: string } }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-stone-900 dark:text-stone-100 mb-1">{data.name}</p>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {data.value}票 ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* チャート表示 */}
      {totalVotes > 0 && (
        <div className="mb-8">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 投票がない場合のメッセージ */}
      {totalVotes === 0 && (
        <div className="text-center py-8">
          <p className="text-stone-500 dark:text-stone-400">まだ投票がありません</p>
        </div>
      )}

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

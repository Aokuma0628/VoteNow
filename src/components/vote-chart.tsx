'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Vote, VoteOption } from '@/types/vote';
import { VoteUtils } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VoteChartProps {
  vote: Vote;
  showPercentage?: boolean;
  height?: number;
  className?: string;
}

interface ChartDataItem {
  name: string;
  votes: number;
  percentage: number;
  color: string;
}

// 投票結果グラフのカラーパレット
const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#6b7280', // gray-500
];

export function VoteChart({ vote, showPercentage = true, height = 300, className = '' }: VoteChartProps) {
  // グラフ用のデータを準備
  const chartData: ChartDataItem[] = vote.options.map((option, index) => ({
    name: option.text.length > 15 ? `${option.text.slice(0, 15)}...` : option.text,
    votes: option.votes,
    percentage: VoteUtils.getVotePercentage(option, vote.totalVotes),
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const originalOption = vote.options.find(opt => 
        opt.text === label || opt.text.startsWith(label.replace('...', ''))
      );
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {originalOption?.text || label}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            投票数: <span className="font-semibold text-blue-600">{data.votes}票</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            割合: <span className="font-semibold text-green-600">{data.percentage}%</span>
          </p>
          {originalOption?.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {originalOption.description}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Y軸のラベルフォーマッター
  const formatYAxisLabel = (value: number) => {
    return showPercentage ? `${value}%` : value.toString();
  };

  // データの最大値を取得（Y軸の範囲設定用）
  const maxValue = Math.max(...chartData.map(item => showPercentage ? item.percentage : item.votes));
  const yAxisMax = Math.ceil(maxValue * 1.1); // 少し余裕を持たせる

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          投票結果グラフ
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>総投票数: {vote.totalVotes}票</span>
          <span>{showPercentage ? '割合表示' : '票数表示'}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-30"
                stroke="currentColor"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={formatYAxisLabel}
                domain={[0, yAxisMax]}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={showPercentage ? 'percentage' : 'votes'}
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* 凡例 */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {vote.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-gray-700 dark:text-gray-300 truncate" title={option.text}>
                {option.text}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-auto">
                {option.votes}票 ({VoteUtils.getVotePercentage(option, vote.totalVotes)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 複数の投票を比較表示するコンポーネント
interface MultiVoteChartProps {
  votes: Vote[];
  className?: string;
}

export function MultiVoteChart({ votes, className = '' }: MultiVoteChartProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {votes.map(vote => (
        <VoteChart key={vote.id} vote={vote} />
      ))}
    </div>
  );
}
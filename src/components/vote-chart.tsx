'use client';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PollWithDetails } from '@/types/api';
import { useMemo, useState, useEffect } from 'react';

interface VoteChartProps {
  vote: PollWithDetails;
  className?: string;
}

// グラフの色パレット
const COLORS = [
  '#10B981', // emerald-500
  '#3B82F6', // blue-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
  '#EC4899', // pink-500
  '#6B7280', // gray-500
];

export function VoteChart({ vote, className }: VoteChartProps) {
  // グラフ用のデータを準備
  const chartData = useMemo(() => {
    return vote.options.map((option, index) => ({
      name: option.text.length > 15 ? `${option.text.slice(0, 15)}...` : option.text,
      fullName: option.text,
      votes: option._count.votes,
      percentage:
        vote.totalVotes > 0 ? ((option._count.votes / vote.totalVotes) * 100).toFixed(1) : '0.0',
      color: COLORS[index % COLORS.length],
    }));
  }, [vote.options, vote.totalVotes]);

  // アニメーション用のデータ
  const [animatedData, setAnimatedData] = useState<typeof chartData>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // データ変更時のアニメーション
  useEffect(() => {
    // 初回マウント時
    if (animatedData.length === 0) {
      setAnimatedData(chartData);
      return;
    }

    // アニメーション中は新しいアニメーションを開始しない
    if (isAnimating) {
      return;
    }

    // データに変更がない場合はアニメーションしない
    const hasDataChanged = chartData.some((item, index) => {
      const animatedItem = animatedData[index];
      return !animatedItem || animatedItem.votes !== item.votes;
    });

    if (!hasDataChanged) {
      return;
    }

    // データ更新時
    setIsAnimating(true);
    const startData = [...animatedData];
    const duration = 700;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newData = chartData.map(target => {
        const start = startData.find(d => d.fullName === target.fullName) || { votes: 0 };
        const currentVotes = Math.round(start.votes + (target.votes - start.votes) * easeOut);
        const currentPercentage =
          vote.totalVotes > 0 ? ((currentVotes / vote.totalVotes) * 100).toFixed(1) : '0.0';

        return {
          ...target,
          votes: currentVotes,
          percentage: currentPercentage,
        };
      });

      setAnimatedData(newData);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, vote.totalVotes]);

  // カスタムツールチップ
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { fullName: string; votes: number; percentage: string; color: string } }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-stone-900 dark:text-stone-100 mb-1">{data.fullName}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: data.color }} />
            <span className="text-sm text-stone-600 dark:text-stone-400">
              {data.votes}票 ({data.percentage}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">投票結果</CardTitle>
        <p className="text-sm text-stone-600 dark:text-stone-400">総投票数: {vote.totalVotes}票</p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={animatedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-stone-200 dark:stroke-stone-700"
              />
              <XAxis
                dataKey="name"
                fontSize={12}
                className="text-stone-600 dark:text-stone-400"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                fontSize={12}
                className="text-stone-600 dark:text-stone-400"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="votes"
                radius={[4, 4, 0, 0]}
                animationBegin={0}
                animationDuration={700}
                animationEasing="ease-out"
              >
                {animatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 詳細統計 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {animatedData.map((item, index) => {
            const originalItem = chartData.find(d => d.fullName === item.fullName);
            const hasChanged = originalItem && originalItem.votes !== item.votes;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 rounded-lg transition-all duration-300 ${
                  hasChanged && isAnimating ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                    {item.fullName}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {item.votes}票
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-400">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 投票なしの場合 */}
        {vote.totalVotes === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-500 dark:text-stone-400">まだ投票がありません</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import React from 'react';
import KPICard from '../../components/KPICard';
import EChartWrapper from '../../charts/EChartWrapper';
import { getMarketingData } from '../../services/mockData';
import { useDateFilter } from '../../contexts/DateFilterContext';
import { Award } from 'lucide-react';

const Marketing = () => {
  const { startDate, endDate } = useDateFilter();
  const mkt = getMarketingData(startDate, endDate);
  const { trafficSplit, revenueBySource, roas, adSpend } = mkt;

  // Pie chart option for Traffic Split
  const trafficSplitOption = {
    title: {
      text: 'Traffic Acquisition Split',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'item', formatter: '{b}: {c} visitors ({d}%)' },
    legend: {
      orient: 'horizontal',
      bottom: '0'
    },
    series: [
      {
        name: 'Traffic Channels',
        type: 'pie',
        radius: '55%',
        center: ['50%', '45%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
          borderColor: 'transparent',
          borderWidth: 2
        },
        data: trafficSplit.map((t, idx) => {
          const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981'];
          return {
            name: t.name,
            value: t.value,
            itemStyle: { color: colors[idx % colors.length] }
          };
        }),
        label: {
          show: true,
          fontSize: 10,
          formatter: '{b}'
        }
      }
    ]
  };

  // Bar chart option for Revenue By Source
  const revenueSourceOption = {
    title: {
      text: 'Revenue Contribution by Channel',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: revenueBySource.map(r => r.source),
      axisLabel: { rotate: 20 },
      axisLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '${value}' }
    },
    series: [
      {
        name: 'Revenue Contributions ($)',
        type: 'bar',
        barWidth: '40%',
        data: revenueBySource.map(r => r.revenue),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#06b6d4' },
              { offset: 1, color: '#6366f1' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };

  const totalMarketingRevenue = revenueBySource.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Return on Ad Spend (ROAS)"
          value={`${roas}x`}
          compChange={4.2}
          formatType="text"
        />
        <KPICard
          title="Total Ad Spend"
          value={adSpend}
          compChange={-1.5}
          formatType="currency"
        />
        <KPICard
          title="Total Marketing Revenue"
          value={totalMarketingRevenue}
          compChange={8.6}
          formatType="currency"
        />
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 to-transparent blur-xl rounded-full" />
          <div>
            <span className="text-cosmic-muted text-sm font-medium">Efficiency Index</span>
            <h3 className="text-3xl font-extrabold text-cosmic-text mt-2">A+</h3>
            <span className="text-[10px] text-cosmic-success font-semibold mt-1 block">Optimal budget deployment</span>
          </div>
          <Award size={36} className="text-cosmic-accent opacity-75 shrink-0" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
          <EChartWrapper option={trafficSplitOption} height="320px" />
        </div>
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl lg:col-span-2">
          <EChartWrapper option={revenueSourceOption} height="320px" />
        </div>
      </div>
    </div>
  );
};

export default Marketing;

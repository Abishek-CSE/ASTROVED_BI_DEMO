import React from 'react';
import KPICard from '../../components/KPICard';
import EChartWrapper from '../../charts/EChartWrapper';
import { getCustomerData } from '../../services/mockData';
import { useDateFilter } from '../../contexts/DateFilterContext';
import { Heart } from 'lucide-react';

const Customer = () => {
  const { startDate, endDate } = useDateFilter();
  const customer = getCustomerData(startDate, endDate);
  const { users, clv, repeatPurchaseRate, retentionRate } = customer;

  // New vs Returning Users Pie Chart
  const usersOption = {
    title: {
      text: 'User Distribution',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      bottom: '0'
    },
    series: [
      {
        name: 'Users Type',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'transparent',
          borderWidth: 2
        },
        label: { show: false },
        data: users.map((u, idx) => {
          const colors = ['#6366f1', '#06b6d4'];
          return {
            name: u.name,
            value: u.value,
            itemStyle: { color: colors[idx] }
          };
        })
      }
    ]
  };

  // CLV Range Bar Chart
  const clvOption = {
    title: {
      text: 'Customer Lifetime Value Distribution',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: clv.map(c => c.range),
      axisLine: { show: false }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Customers count',
        type: 'bar',
        barWidth: '50%',
        data: clv.map(c => c.users),
        itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  // Retention Rate Line Chart
  const retentionOption = {
    title: {
      text: 'Monthly Cohort Retention Curve',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: retentionRate.map(r => r.month),
      axisLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}%' },
      max: 100
    },
    series: [
      {
        name: 'Retention Rate',
        type: 'line',
        smooth: true,
        data: retentionRate.map(r => r.rate),
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  const totalUsers = users.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard
          title="Total Users Analyzed"
          value={totalUsers}
          compChange={6.8}
          formatType="number"
        />
        <KPICard
          title="Repeat Purchase Rate"
          value={repeatPurchaseRate}
          compChange={2.1}
          formatType="percentage"
        />
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 to-transparent blur-xl rounded-full" />
          <div>
            <span className="text-cosmic-muted text-sm font-medium">Customer Health Index</span>
            <h3 className="text-3xl font-extrabold text-cosmic-text mt-2">Good</h3>
            <span className="text-[10px] text-cosmic-success font-semibold mt-1 block">RPR is top 15% in sector</span>
          </div>
          <Heart size={36} className="text-cosmic-success opacity-75 shrink-0 animate-pulse" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
          <EChartWrapper option={usersOption} height="280px" />
        </div>
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
          <EChartWrapper option={clvOption} height="280px" />
        </div>
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
          <EChartWrapper option={retentionOption} height="280px" />
        </div>
      </div>
    </div>
  );
};

export default Customer;

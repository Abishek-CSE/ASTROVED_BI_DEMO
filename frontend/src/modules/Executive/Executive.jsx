import React from 'react';
import EChartWrapper from '../../charts/EChartWrapper';
import { getExecutiveData, formatTaka } from '../../services/mockData';
import { useDateFilter } from '../../contexts/DateFilterContext';
import {
  Target, Download, FileSpreadsheet, FileText, FilePlus, Sparkles
} from 'lucide-react';

const Executive = () => {
  const { startDate, endDate, compareEnabled, getCompareDates } = useDateFilter();
  const data = getExecutiveData(startDate, endDate, compareEnabled, getCompareDates);
  const { kpi, revenueTrend, categories, channels, topProducts, recentOrders, targetComparison, traffic } = data;

  // Mini Sparkline Options
  const makeSparklineOption = (color, dataValues) => ({
    grid: { left: 0, right: 0, top: 5, bottom: 5 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        data: dataValues,
        showSymbol: false,
        smooth: true,
        lineStyle: { width: 1.5, color: color },
        areaStyle: { color: color + '15' }
      }
    ]
  });

  // 1. Revenue Overview Option
  const revenueOverviewOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Revenue (৳)', 'Orders'],
      right: '5%',
      top: '0%'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: revenueTrend.map(d => d.date),
      axisLine: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Revenue',
        splitLine: { show: true },
        axisLabel: { formatter: (val) => `${val / 100000}L` }
      },
      {
        type: 'value',
        name: 'Orders',
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Revenue (৳)',
        type: 'line',
        smooth: true,
        data: revenueTrend.map(d => d.revenue),
        itemStyle: { color: '#6366f1' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.25)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.0)' }
            ]
          }
        }
      },
      {
        name: 'Orders',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: revenueTrend.map(d => d.orders),
        itemStyle: { color: '#22c55e' }
      }
    ]
  };

  // 2. Donut: Category Option
  const categoryOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '৳ 3.28Cr\nTotal',
          fontSize: 12,
          fontWeight: 'bold',
          lineHeight: 16
        },
        data: categories.map((c, index) => {
          const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#a855f7'];
          return {
            name: `${c.name}   ${c.value}%`,
            value: c.raw,
            itemStyle: { color: colors[index % colors.length] }
          };
        })
      }
    ]
  };

  // 3. Donut: Channel Option
  const channelOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '৳ 3.28Cr\nTotal',
          fontSize: 12,
          fontWeight: 'bold',
          lineHeight: 16
        },
        data: channels.map((c, index) => {
          const colors = ['#10b981', '#6366f1', '#f59e0b', '#06b6d4', '#ef4444'];
          return {
            name: `${c.name}   ${c.value}%`,
            value: c.raw,
            itemStyle: { color: colors[index % colors.length] }
          };
        })
      }
    ]
  };

  // 4. Bar: Revenue vs Target Option
  const targetOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['Revenue (৳)', 'Target (৳)'],
      right: '5%',
      top: '0%'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: targetComparison.map(t => t.week),
      axisLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (val) => `${val / 100000}L` }
    },
    series: [
      {
        name: 'Revenue (৳)',
        type: 'bar',
        barGap: '15%',
        barWidth: 10,
        data: targetComparison.map(t => t.revenue),
        itemStyle: { color: '#2563eb', borderRadius: [2, 2, 0, 0] }
      },
      {
        name: 'Target (৳)',
        type: 'bar',
        barWidth: 10,
        data: targetComparison.map(t => t.target),
        itemStyle: { color: '#10b981', borderRadius: [2, 2, 0, 0] }
      }
    ]
  };

  // 5. Traffic Overview Option
  const trafficOverviewOption = {
    grid: { left: 0, right: 0, top: 5, bottom: 5 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        data: traffic.trend,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: '#a855f7' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(168, 85, 247, 0.25)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="space-y-6">

      {/* ----------------- ROW 1: 7 KPI CARDS ----------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">

        {/* Card 1: Daily Revenue */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-cosmic-muted text-[10px] font-semibold">Daily Revenue</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold">
              +{kpi.dailyRevenue.compChange}% vs Yesterday
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-cosmic-text mt-2">{formatTaka(kpi.dailyRevenue.current)}</h3>
          <div className="h-6 mt-2">
            <EChartWrapper option={makeSparklineOption('#10b981', [10, 15, 12, 18, 16, 22, 20])} height="100%" />
          </div>
        </div>

        {/* Card 2: MTD Revenue */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-cosmic-muted text-[10px] font-semibold">MTD Revenue</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold">
              +{kpi.mtdRevenue.compChange}% vs Last Month
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-cosmic-text mt-2">{formatTaka(kpi.mtdRevenue.current)}</h3>
          <div className="h-6 mt-2">
            <EChartWrapper option={makeSparklineOption('#3b82f6', [8, 12, 14, 11, 16, 18, 24])} height="100%" />
          </div>
        </div>

        {/* Card 3: YTD Revenue */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-cosmic-muted text-[10px] font-semibold">YTD Revenue</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold">
              +{kpi.ytdRevenue.compChange}% vs Last Year
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-cosmic-text mt-2">{formatTaka(kpi.ytdRevenue.current)}</h3>
          <div className="h-6 mt-2">
            <EChartWrapper option={makeSparklineOption('#a855f7', [15, 18, 20, 22, 25, 28, 32])} height="100%" />
          </div>
        </div>

        {/* Card 4: Orders */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-cosmic-muted text-[10px] font-semibold">Orders</span>
            <span className="p-1 rounded bg-orange-500/10 text-orange-500 text-[8px] font-bold">
              +{kpi.orders.compChange}% vs Yesterday
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-cosmic-text mt-2">{kpi.orders.current.toLocaleString()}</h3>
          <div className="h-6 mt-2">
            <EChartWrapper option={makeSparklineOption('#f97316', [20, 18, 22, 25, 21, 28, 30])} height="100%" />
          </div>
        </div>

        {/* Card 5: Conversion Rate */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-cosmic-muted text-[10px] font-semibold">Conversion Rate</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold">
              +{kpi.conversionRate.compChange}% vs Yesterday
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-cosmic-text mt-2">{kpi.conversionRate.current}%</h3>
          <div className="h-6 mt-2">
            <EChartWrapper option={makeSparklineOption('#06b6d4', [2.5, 2.8, 3.1, 2.9, 3.2, 3.5, 3.62])} height="100%" />
          </div>
        </div>

        {/* Card 6: Forecast */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-cosmic-muted text-[10px] font-semibold">Forecast (This Month)</span>
            <span className="p-1 rounded bg-rose-500/10 text-rose-500 text-[8px] font-bold">
              +{kpi.forecast.compChange}% vs Target
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-cosmic-text mt-2">{formatTaka(kpi.forecast.current)}</h3>
          <div className="h-6 mt-2">
            <EChartWrapper option={makeSparklineOption('#f43f5e', [30, 32, 28, 35, 38, 40, 42.5])} height="100%" />
          </div>
        </div>

        {/* Card 7: Revenue Target Progress */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-1">
          <div className="flex items-center space-x-1">
            <Target size={12} className="text-amber-500 animate-pulse" />
            <span className="text-cosmic-muted text-[10px] font-semibold">Revenue Target</span>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-extrabold text-cosmic-text">{kpi.target.pct}%</h3>
            <div className="w-full bg-cosmic-bg h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${kpi.target.pct}%` }} />
            </div>
          </div>
          <span className="text-[9px] text-cosmic-muted mt-2 block">{formatTaka(kpi.target.current)}</span>
        </div>

      </div>

      {/* ----------------- ROW 2: CHARTS ROW (Revenue line, Category donut, Channel donut) ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Overview */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-cosmic-text">Revenue Overview</h4>
            <select className="bg-cosmic-bg border border-cosmic-border text-[10px] text-cosmic-muted px-2 py-0.5 rounded focus:outline-none">
              <option>This Week</option>
            </select>
          </div>
          <EChartWrapper option={revenueOverviewOption} height="220px" />
        </div>

        {/* Revenue by Category */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-cosmic-text">Revenue by Category</h4>
            <select className="bg-cosmic-bg border border-cosmic-border text-[10px] text-cosmic-muted px-2 py-0.5 rounded focus:outline-none">
              <option>This Month</option>
            </select>
          </div>
          <EChartWrapper option={categoryOption} height="220px" />
        </div>

        {/* Revenue by Channel */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-cosmic-text">Revenue by Channel</h4>
            <select className="bg-cosmic-bg border border-cosmic-border text-[10px] text-cosmic-muted px-2 py-0.5 rounded focus:outline-none">
              <option>This Month</option>
            </select>
          </div>
          <EChartWrapper option={channelOption} height="220px" />
        </div>

      </div>

      {/* ----------------- ROW 3: LISTS & COMPARISONS (Top Selling, Recent Orders, Rev vs Target) ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Selling Products */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-cosmic-text">Top Selling Products</h4>
              <select className="bg-cosmic-bg border border-cosmic-border text-[10px] text-cosmic-muted px-2 py-0.5 rounded focus:outline-none">
                <option>This Month</option>
              </select>
            </div>
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-cosmic-border text-cosmic-muted font-semibold">
                  <th className="py-2 w-8">#</th>
                  <th className="py-2">Product</th>
                  <th className="py-2 text-right">Revenue (৳)</th>
                  <th className="py-2 text-right">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cosmic-border/30 text-cosmic-text">
                {topProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-cosmic-card-hover transition-colors">
                    <td className="py-2 font-mono text-cosmic-muted">{prod.id}</td>
                    <td className="py-2 font-semibold text-cosmic-text">{prod.name}</td>
                    <td className="py-2 text-right font-semibold">{formatTaka(prod.revenue)}</td>
                    <td className="py-2 text-right font-mono text-cosmic-muted">{prod.orders.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="text-indigo-400 hover:text-indigo-355 text-[10px] font-bold text-center mt-3 pt-3 border-t border-cosmic-border block w-full">
            View All
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-cosmic-text">Recent Orders</h4>
            </div>
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-cosmic-border text-cosmic-muted font-semibold">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2 text-right">Amount (৳)</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cosmic-border/30 text-cosmic-text">
                {recentOrders.map((ord, idx) => (
                  <tr key={idx} className="hover:bg-cosmic-card-hover transition-colors">
                    <td className="py-2 font-mono text-indigo-400">{ord.id}</td>
                    <td className="py-2 font-semibold text-cosmic-text">{ord.customer}</td>
                    <td className="py-2 text-right font-mono">{formatTaka(ord.amount)}</td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${ord.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-2 text-right text-cosmic-muted text-[10px]">{ord.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="text-indigo-400 hover:text-indigo-355 text-[10px] font-bold text-center mt-3 pt-3 border-t border-cosmic-border block w-full">
            View All Orders
          </button>
        </div>

        {/* Revenue vs Target */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-cosmic-text">Revenue vs Target</h4>
            <select className="bg-cosmic-bg border border-cosmic-border text-[10px] text-cosmic-muted px-2 py-0.5 rounded focus:outline-none">
              <option>This Month</option>
            </select>
          </div>
          <EChartWrapper option={targetOption} height="210px" />
        </div>

      </div>

      {/* ----------------- ROW 4: AI INSIGHTS, TRAFFIC OVERVIEW, QUICK REPORTS, EXPORTS ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* AI Insights Card */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-cosmic-text flex items-center mb-3">
              <Sparkles size={14} className="text-fuchsia-500 mr-1.5 animate-pulse" />
              AI Insights
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <p className="text-[10px] leading-relaxed text-cosmic-text">
                  Revenue increased by <strong className="text-emerald-400">18.7%</strong> this month mainly due to growth in Puja Services and Gemstone sales.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <p className="text-[10px] leading-relaxed text-cosmic-text">
                  Paid Ads generated <strong className="text-emerald-400">28.3%</strong> of total revenue. Consider increasing budget for better ROAS.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <p className="text-[10px] leading-relaxed text-cosmic-text">
                  Conversion rate improved by <strong className="text-emerald-400">0.48%</strong> compared to yesterday.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <p className="text-[10px] leading-relaxed text-cosmic-text">
                  <strong className="text-amber-400">Recommended Action:</strong> Focus on top performing products and retarget cart abandoners.
                </p>
              </div>
            </div>
          </div>
          <button className="text-indigo-400 hover:text-indigo-355 text-[10px] font-bold text-center mt-3 pt-3 border-t border-cosmic-border block w-full">
            View All Insights
          </button>
        </div>

        {/* Traffic Overview */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-cosmic-text mb-3">Traffic Overview (This Month)</h4>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-cosmic-muted text-[9px] font-semibold uppercase block">Organic Traffic</span>
                <span className="text-xs font-bold text-cosmic-text">{traffic.metrics.organic.count.toLocaleString()}</span>
                <span className="text-[8px] text-emerald-500 font-bold block mt-0.5">↑ {traffic.metrics.organic.change}%</span>
              </div>
              <div>
                <span className="text-cosmic-muted text-[9px] font-semibold uppercase block">Paid Traffic</span>
                <span className="text-xs font-bold text-cosmic-text">{traffic.metrics.paid.count.toLocaleString()}</span>
                <span className="text-[8px] text-emerald-500 font-bold block mt-0.5">↑ {traffic.metrics.paid.change}%</span>
              </div>
              <div>
                <span className="text-cosmic-muted text-[9px] font-semibold uppercase block">Total Visitors</span>
                <span className="text-xs font-bold text-cosmic-text">{traffic.metrics.total.count.toLocaleString()}</span>
                <span className="text-[8px] text-emerald-500 font-bold block mt-0.5">↑ {traffic.metrics.total.change}%</span>
              </div>
              <div>
                <span className="text-cosmic-muted text-[9px] font-semibold uppercase block">Bounce Rate</span>
                <span className="text-xs font-bold text-cosmic-text">{traffic.metrics.bounce.count}%</span>
                <span className="text-[8px] text-rose-500 font-bold block mt-0.5">↓ {Math.abs(traffic.metrics.bounce.change)}%</span>
              </div>
            </div>
          </div>
          <div className="h-10 mt-3">
            <EChartWrapper option={trafficOverviewOption} height="100%" />
          </div>
        </div>

        {/* Quick Reports List */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-cosmic-text mb-2">Quick Reports</h4>
          {['Daily Report', 'Weekly Report', 'Monthly Report', 'Quarterly Report', 'Yearly Report'].map((reportName, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs text-cosmic-text p-2 rounded bg-cosmic-bg border border-cosmic-border">
              <span className="font-semibold text-[10px]">{reportName}</span>
              <button className="text-cosmic-muted hover:text-cosmic-text transition-colors">
                <Download size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Export Reports Buttons */}
        <div className="bg-cosmic-card border border-cosmic-border p-4 rounded-xl flex flex-col justify-center space-y-2.5">
          <h4 className="text-xs font-bold text-cosmic-text mb-1">Export Reports</h4>

          <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600/20 transition-all font-semibold text-xs active:scale-[0.98]">
            <span className="flex items-center gap-2">
              <FileSpreadsheet size={14} />
              <span>Export to Excel</span>
            </span>
            <Download size={12} />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-500 hover:bg-rose-600/20 transition-all font-semibold text-xs active:scale-[0.98]">
            <span className="flex items-center gap-2">
              <FileText size={14} />
              <span>Export to PDF</span>
            </span>
            <Download size={12} />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-500 hover:bg-cyan-600/20 transition-all font-semibold text-xs active:scale-[0.98]">
            <span className="flex items-center gap-2">
              <FilePlus size={14} />
              <span>Export to CSV</span>
            </span>
            <Download size={12} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Executive;

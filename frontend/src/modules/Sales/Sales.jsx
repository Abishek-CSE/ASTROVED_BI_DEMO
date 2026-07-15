import React from 'react';
import EChartWrapper from '../../charts/EChartWrapper';
import { getSalesData, formatCurrency } from '../../services/mockData';
import { useDateFilter } from '../../contexts/DateFilterContext';
import { ShoppingBag, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

const Sales = () => {
  const { startDate, endDate } = useDateFilter();
  const salesData = getSalesData(startDate, endDate);
  const { categories, countries, currencies, bestSellers, lowPerformers } = salesData;

  // Category Revenue Pie Chart
  const categoryOption = {
    title: {
      text: 'Revenue by Category',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'item', formatter: '{b}: ${c} ({d}%)' },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: 'Categories',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'transparent',
          borderWidth: 2
        },
        label: { show: false },
        data: categories.map((c, index) => {
          const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'];
          return {
            name: c.name,
            value: c.value,
            itemStyle: { color: colors[index % colors.length] }
          };
        })
      }
    ]
  };

  // Country Revenue Bar Chart
  const countryOption = {
    title: {
      text: 'Revenue by Country',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'value',
      axisLabel: { formatter: '${value}' }
    },
    yAxis: {
      type: 'category',
      data: countries.map(c => c.name).reverse(),
      axisLine: { show: false }
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: countries.map(c => c.value).reverse(),
        itemStyle: { color: '#6366f1', borderRadius: [0, 4, 4, 0] }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Upper Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
          <EChartWrapper option={categoryOption} height="280px" />
        </div>
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl">
          <EChartWrapper option={countryOption} height="280px" />
        </div>
      </div>

      {/* Currency breakdown + Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currency Card */}
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h4 className="text-cosmic-text font-semibold text-sm mb-4 flex items-center">
              <DollarSign size={16} className="text-cosmic-accent mr-1.5" />
              Currency Share Breakdown
            </h4>
            <div className="space-y-4">
              {currencies.map((curr, idx) => {
                const colors = ['bg-indigo-500', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];
                return (
                  <div key={curr.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-cosmic-text">{curr.name}</span>
                      <span className="text-cosmic-muted">{curr.value}%</span>
                    </div>
                    <div className="w-full bg-cosmic-bg h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[idx % colors.length]}`} 
                        style={{ width: `${curr.value}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[10px] text-cosmic-muted mt-6">
            INR represents the core transactional volume; USD leads in average cart values.
          </p>
        </div>

        {/* Product performance (Best & Low Performers) */}
        <div className="bg-cosmic-card border border-cosmic-border p-6 rounded-2xl lg:col-span-2 space-y-6">
          {/* Best Sellers */}
          <div>
            <h4 className="text-cosmic-text font-semibold text-sm mb-3 flex items-center">
              <ShoppingBag size={16} className="text-cosmic-success mr-1.5" />
              Best Selling Products
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cosmic-border text-cosmic-muted font-medium">
                    <th className="py-2">Code</th>
                    <th className="py-2">Product Name</th>
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right pr-4">Units Sold</th>
                    <th className="py-2 text-right pr-2">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cosmic-border/30 text-cosmic-text">
                  {bestSellers.map((prod) => (
                    <tr key={prod.id} className="hover:bg-cosmic-card-hover transition-colors">
                      <td className="py-2.5 font-mono text-indigo-400">{prod.id}</td>
                      <td className="py-2.5 font-medium">{prod.name}</td>
                      <td className="py-2.5 text-cosmic-muted">{prod.category}</td>
                      <td className="py-2.5 text-right font-medium pr-4">{prod.sales}</td>
                      <td className="py-2.5 text-right font-bold text-cosmic-success pr-2">${prod.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Performers */}
          <div className="pt-4 border-t border-cosmic-border">
            <h4 className="text-cosmic-text font-semibold text-sm mb-3 flex items-center">
              <TrendingDown size={16} className="text-cosmic-danger mr-1.5" />
              Low Performing Products / Alert List
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cosmic-border text-cosmic-muted font-medium">
                    <th className="py-2">Code</th>
                    <th className="py-2">Product Name</th>
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right pr-4">Units Sold</th>
                    <th className="py-2 text-right pr-4">Revenue</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cosmic-border/30 text-cosmic-text">
                  {lowPerformers.map((prod) => (
                    <tr key={prod.id} className="hover:bg-cosmic-card-hover transition-colors">
                      <td className="py-2.5 font-mono text-indigo-400">{prod.id}</td>
                      <td className="py-2.5 font-medium">{prod.name}</td>
                      <td className="py-2.5 text-cosmic-muted">{prod.category}</td>
                      <td className="py-2.5 text-right font-medium pr-4">{prod.sales}</td>
                      <td className="py-2.5 text-right font-bold text-cosmic-danger pr-4">${prod.revenue.toLocaleString()}</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          prod.status === 'Warning' 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          <AlertCircle size={10} className="mr-1" />
                          {prod.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;

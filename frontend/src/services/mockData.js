// Deterministic helper to generate stable values based on input dates
const getSeedForDates = (start, end) => {
  const s = String(start) + String(end);
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getSeededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const formatTaka = (val) => {
  if (val === undefined || val === null) return '₹ 0';
  return '₹ ' + Math.round(val).toLocaleString('en-IN');
};

export const formatCurrency = (val, currency = 'USD') => {
  const symbols = { USD: '$', EUR: '€', INR: '₹', GBP: '£' };
  const sym = symbols[currency] || '$';
  if (val >= 1000000) return `${sym}${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${sym}${(val / 1000).toFixed(1)}K`;
  return `${sym}${val.toFixed(0)}`;
};


export const getExecutiveData = (startDate, endDate, compareEnabled, getCompareDates) => {
  // Static-like realistic values as seen in the mockup, but slightly dynamic if needed
  return {
    kpi: {
      dailyRevenue: { current: 1245230, compChange: 12.5 },
      mtdRevenue: { current: 32875900, compChange: 18.7 },
      ytdRevenue: { current: 324512600, compChange: 24.3 },
      orders: { current: 8542, compChange: 11.3 },
      conversionRate: { current: 3.62, compChange: 0.48 },
      forecast: { current: 425000000, compChange: 15.6 },
      target: { current: 425000000, pct: 82.4 }
    },
    // Chart data for Revenue Overview (Line chart)
    revenueTrend: [
      { date: 'May 13', revenue: 1200000, orders: 820 },
      { date: 'May 14', revenue: 1500000, orders: 950 },
      { date: 'May 15', revenue: 1350000, orders: 890 },
      { date: 'May 16', revenue: 1600000, orders: 1100 },
      { date: 'May 17', revenue: 1450000, orders: 980 },
      { date: 'May 18', revenue: 1900000, orders: 1250 },
      { date: 'May 19', revenue: 1750000, orders: 1150 }
    ],
    // Donut chart: Revenue by Category
    categories: [
      { name: 'Puja Services', value: 38.4, raw: 12624345 },
      { name: 'Gemstones', value: 24.7, raw: 8120347 },
      { name: 'Consultation', value: 18.1, raw: 5950537 },
      { name: 'Products', value: 12.6, raw: 4142363 },
      { name: 'Others', value: 6.2, raw: 2038308 }
    ],
    // Donut chart: Revenue by Channel
    channels: [
      { name: 'Organic', value: 42.5, raw: 13972257 },
      { name: 'Paid Ads', value: 28.3, raw: 9303880 },
      { name: 'Direct', value: 15.6, raw: 5128640 },
      { name: 'Email', value: 7.8, raw: 2564320 },
      { name: 'Social', value: 5.8, raw: 1906803 }
    ],
    // Top Selling Products
    topProducts: [
      { id: 1, name: 'Rudraksha Mala', revenue: 4578900, orders: 1254 },
      { id: 2, name: 'Gemstone Ring', revenue: 3244600, orders: 982 },
      { id: 3, name: 'Navagraha Puja', revenue: 2875300, orders: 735 },
      { id: 4, name: 'Lal Kitab Report', revenue: 2218700, orders: 621 },
      { id: 5, name: 'Birth Chart', revenue: 1832400, orders: 512 }
    ],
    // Recent Orders
    recentOrders: [
      { id: '#AVD12548', customer: 'Rahul Sharma', amount: 5450, status: 'Paid', time: '10 min ago' },
      { id: '#AVD12547', customer: 'Priya Patel', amount: 3250, status: 'Paid', time: '25 min ago' },
      { id: '#AVD12546', customer: 'Sandeep Verma', amount: 8950, status: 'Paid', time: '40 min ago' },
      { id: '#AVD12545', customer: 'Ananya Singh', amount: 2150, status: 'Pending', time: '1 hr ago' },
      { id: '#AVD12544', customer: 'Amit Mishra', amount: 4780, status: 'Paid', time: '2 hr ago' }
    ],
    // Revenue vs Target (Bar chart comparison)
    targetComparison: [
      { week: 'Week 1', revenue: 6500000, target: 8000000 },
      { week: 'Week 2', revenue: 7800000, target: 8000000 },
      { week: 'Week 3', revenue: 8400000, target: 8500000 },
      { week: 'Week 4', revenue: 9100000, target: 8500000 },
      { week: 'Week 5', revenue: 9500000, target: 9000000 }
    ],
    // Traffic overview
    traffic: {
      metrics: {
        organic: { count: 125430, change: 15.4 },
        paid: { count: 85230, change: 22.1 },
        total: { count: 210660, change: 18.7 },
        bounce: { count: 32.6, change: -5.3 }
      },
      trend: [10000, 12000, 11000, 13000, 12500, 15000, 14000]
    }
  };
};

export const getSalesData = (startDate, endDate) => {
  return {
    categories: [
      { name: 'Pooja Services', value: 12624345 },
      { name: 'Gemstones', value: 8120347 },
      { name: 'Consultation', value: 5950537 },
      { name: 'Products', value: 4142363 },
      { name: 'Others', value: 2038308 },
    ],
    countries: [
      { name: 'India', value: 25000000 },
      { name: 'United States', value: 14000000 },
      { name: 'United Kingdom', value: 6200000 },
      { name: 'Canada', value: 4500000 },
      { name: 'Australia', value: 3800000 },
    ],
    currencies: [
      { name: 'INR (₹)', value: 52 },
      { name: 'USD ($)', value: 31 },
      { name: 'GBP (£)', value: 9 },
      { name: 'CAD (C$)', value: 5 },
      { name: 'AUD (A$)', value: 3 },
    ],
    bestSellers: [
      { id: 'P001', name: 'Premium Yearly Astrology Consultation', category: 'Consultation', revenue: 7850000, sales: 520, status: 'Active' },
      { id: 'P002', name: 'Maha Laxmi Kuber Yantra (Energized)', category: 'Yantras', revenue: 4210000, sales: 340, status: 'Active' },
      { id: 'P003', name: 'Natural Blue Sapphire Gemstone', category: 'Gemstones', revenue: 3890000, sales: 98, status: 'Active' },
    ],
    lowPerformers: [
      { id: 'P009', name: 'Daily Horoscopes Subscription (SMS)', category: 'Reports', revenue: 120000, sales: 120, status: 'Warning' },
      { id: 'P010', name: 'Brass Vastu Pyramid (Small)', category: 'Yantras', revenue: 85000, sales: 34, status: 'Critical' },
    ]
  };
};

export const getMarketingData = (startDate, endDate) => {
  return {
    trafficSplit: [
      { name: 'Organic Traffic', value: 125430 },
      { name: 'Paid Traffic', value: 85230 },
      { name: 'Direct/Email', value: 31280 },
      { name: 'Social Media', value: 15640 },
    ],
    revenueBySource: [
      { source: 'Organic Search', revenue: 14500000 },
      { source: 'Paid Search (Google Ads)', revenue: 9300000 },
      { source: 'Email Campaigns', revenue: 5400000 },
      { source: 'CRM Push Notifications', revenue: 3800000 },
      { source: 'Banner/Display Ads', revenue: 2100000 },
      { source: 'Social Media Organic', revenue: 2800000 },
    ],
    roas: '3.8',
    adSpend: 2450000
  };
};

export const getSEOData = (startDate, endDate) => {
  return {
    kpis: {
      clicks: 185000,
      impressions: 2450000,
      ctr: '7.55',
      position: '4.2'
    },
    keywords: [
      { word: 'astrology consultation', clicks: 24500, impressions: 210000, ctr: '11.6%', pos: 2.1 },
      { word: 'online pooja booking', clicks: 18200, impressions: 195000, ctr: '9.3%', pos: 3.4 },
    ],
    landingPages: [
      { page: '/consultation/astrologer-live', clicks: 42000, ctr: '14.2%' },
    ],
    winners: [
      { keyword: 'shani transition report 2026', change: '+14 ranks', current: 3 },
    ],
    losers: [
      { keyword: 'free kundli chart', change: '-9 ranks', current: 15 },
    ]
  };
};

export const getCustomerData = (startDate, endDate) => {
  return {
    users: [
      { name: 'New Users', value: 28000 },
      { name: 'Returning Users', value: 14000 },
    ],
    clv: [
      { range: '$10 - $50', users: 22000 },
      { range: '$50 - $150', users: 14000 },
    ],
    repeatPurchaseRate: '34.5',
    retentionRate: [
      { month: 'Month 1', rate: 100 },
      { month: 'Month 2', rate: 74 },
    ]
  };
};

export const getFunnelData = (startDate, endDate) => {
  return [
    { step: 'Visitor', count: 350000, pctOfPrev: 100, pctOfTotal: 100 },
    { step: 'Registration', count: 147000, pctOfPrev: 42, pctOfTotal: 42 },
    { step: 'Product View', count: 111720, pctOfPrev: 76, pctOfTotal: 32 },
    { step: 'Add to Cart', count: 35750, pctOfPrev: 32, pctOfTotal: 10 },
    { step: 'Checkout', count: 25740, pctOfPrev: 72, pctOfTotal: 7.4 },
    { step: 'Payment', count: 22650, pctOfPrev: 88, pctOfTotal: 6.5 },
    { step: 'Purchase', count: 21290, pctOfPrev: 94, pctOfTotal: 6.1 }
  ];
};

export const getOperationsData = (startDate, endDate) => {
  return {
    paymentSuccess: '94.2',
    paymentFailureReasons: [
      { reason: 'User Cancelled', count: 480 },
      { reason: 'Bank Server Downtime', count: 320 },
    ],
    refunds: {
      count: 120,
      amount: 850000,
      rate: '2.1'
    },
    bookings: {
      total: 2800,
      completed: 2576,
      pending: 168,
      cancelled: 56
    },
    services: [
      { name: 'Consultation Video Engine', status: 'Healthy', latency: '42ms' },
    ]
  };
};

export const getAIInsights = (startDate, endDate) => {
  return [
    {
      id: 'AI-001',
      type: 'increase',
      title: 'Consultation Revenue Spike in US market',
      summary: 'Revenue from US Astrology Consultations increased by 24.8% over the selected period.',
      cause: 'Driven by high demand for the new "Yearly Career Forecast" report and Google Ads campaign optimization targeting high-intent US audiences.',
      actions: [
        'Increase daily ad-spend budget on Career Consultation keywords by 15%.',
        'Send promotional emails offering a bundle of Report + Call to prior buyers.'
      ]
    }
  ];
};

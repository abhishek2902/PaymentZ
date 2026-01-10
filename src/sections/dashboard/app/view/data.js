export const filtersOverviewMenu = [
  {
    id: 1,
    name: 'last 7 days',
    value: 'last_7_days',
  },
  {
    id: 2,
    name: 'last 30 days',
    value: 'last_30_days',
  },
  {
    id: 3,
    name: 'last 90 days',
    value: 'last_90_days',
  },
  {
    id: 4,
    name: 'Custom range',
    value: 'custom_range',
  },
];

// Blocked Transactions
export const breakdown = [
  { label: 'Suspicious IP', value: 15 },
  { label: 'Invalid Card', value: 5 },
  { label: 'Velocity Check', value: 3 },
];

// Top Countries
export const topCountries = [
  { code: 'us', name: 'United States', amount: 45231, transactions: 1247 },
  { code: 'gb', name: 'United Kingdom', amount: 23456, transactions: 634 },
  { code: 'ca', name: 'Canada', amount: 18742, transactions: 523 },
  { code: 'au', name: 'Australia', amount: 15983, transactions: 412 },
  { code: 'de', name: 'Germany', amount: 12567, transactions: 298 },
];

// Bank API Health
export const apiHealth = [
  {
    key: 'paymentez',
    name: 'Paymentez',
    icon: 'mdi:credit-card-outline',
    status: 'up',
    latencyMs: 210,
    uptime: 99.98,
  },
  {
    key: 'nuvei',
    name: 'Nuvei',
    icon: 'mdi:link-variant',
    status: 'degraded',
    latencyMs: 650,
    uptime: 99.2,
  },
  {
    key: 'datafast',
    name: 'DataFast',
    icon: 'mdi:server-network',
    status: 'up',
    latencyMs: 180,
    uptime: 99.95,
  },
  {
    key: 'monrem',
    name: 'Monrem',
    icon: 'mdi:shield-check-outline',
    status: 'up',
    latencyMs: 240,
    uptime: 99.89,
  },
  {
    key: 'quantapay',
    name: 'QuantaPay',
    icon: 'mdi:flash-outline',
    status: 'down',
    latencyMs: null,
    uptime: 97.4,
  },
  {
    key: 'mrp',
    name: 'MRP Pay',
    icon: 'mdi:wallet-outline',
    status: 'up',
    latencyMs: 220,
    uptime: 99.71,
  },
];

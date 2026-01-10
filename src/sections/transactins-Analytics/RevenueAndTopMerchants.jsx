import { Box, Avatar, Card, Stack, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify'; // Adjust path if needed

// Sample data
const revenueAdmins = [
  {
    name: 'Sarah Johnson',
    company: 'TechPay Solutions',
    amount: '$847,250',
    percentage: '+12.5%',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    positive: true,
  },
  {
    name: 'Michael Chen',
    company: 'Global Finance Corp',
    amount: '$623,180',
    percentage: '+8.3%',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    positive: true,
  },
  {
    name: 'Emma Rodriguez',
    company: 'PayFlow Systems',
    amount: '$456,920',
    percentage: '-2.1%',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    positive: false,
  },
  {
    name: 'David Wilson',
    company: 'SecurePay Ltd',
    amount: '$334,760',
    percentage: '+5.7%',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    positive: true,
  },
  {
    name: 'Lisa Anderson',
    company: 'FastTrack Payments',
    amount: '$289,450',
    percentage: '+15.2%',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    positive: true,
  },
];

const topMerchants = [
  {
    name: 'TechStore Inc.',
    category: 'Electronics',
    amount: '$1,247,580',
    transactions: '2,847 transactions',
    icon: 'eva:shopping-bag-fill',
    color: 'blue',
  },
  {
    name: 'Fashion Hub',
    category: 'Clothing',
    amount: '$892,340',
    transactions: '1,923 transactions',
    icon: 'solar:bag-bold',
    color: 'purple',
  },
  {
    name: 'GameWorld',
    category: 'Gaming',
    amount: '$678,920',
    transactions: '1,456 transactions',
    icon: 'proicons:game',
    color: 'green',
  },
  {
    name: 'FoodDelight',
    category: 'Food & Beverage',
    amount: '$445,760',
    transactions: '3,245 transactions',
    icon: 'eva:pie-chart-fill',
    color: 'orange',
  },
  {
    name: 'TechGear Pro',
    category: 'Computer Hardware',
    amount: '$334,580',
    transactions: '892 transactions',
    icon: 'eva:monitor-fill',
    color: 'indigo',
  },
];

export default function RevenueAndTopMerchants() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{  }}>
      {/* Revenue by Admin */}
      <Card sx={{ flex: 1, p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Iconify icon="eva:people-fill" width={24} height={24} color="success.main" />
          <Typography variant="h6" fontWeight="bold">
            Revenue by Admin (Last 30 Days)
          </Typography>
        </Stack>
        <Stack spacing={2}>
          {revenueAdmins.map((admin, index) => (
            <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={admin.avatar} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography variant="subtitle2">{admin.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {admin.company}
                  </Typography>
                </Box>
              </Stack>
              <Box textAlign="right">
                <Typography variant="subtitle2">{admin.amount}</Typography>
                <Typography
                  variant="caption"
                  color={admin.positive ? 'success.main' : 'error.main'}
                >
                  {admin.percentage}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Card>

      {/* Top Merchants by Volume */}
      <Card sx={{ flex: 1, p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Iconify icon="eva:shopping-bag-fill" width={24} height={24} color="info.main" />
          <Typography variant="h6" fontWeight="bold">
            Top Merchants by Volume
          </Typography>
        </Stack>
        <Stack spacing={2}>
          {topMerchants.map((merchant, index) => (
            <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40, bgcolor: `${merchant.color}.100` }}>
                  <Iconify icon={merchant.icon} width={24} height={24} color={`${merchant.color}`} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{merchant.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {merchant.category}
                  </Typography>
                </Box>
              </Stack>
              <Box textAlign="right">
                <Typography variant="subtitle2">{merchant.amount}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {merchant.transactions}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

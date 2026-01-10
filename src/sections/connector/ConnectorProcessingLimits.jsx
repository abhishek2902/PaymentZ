import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function ConnectorProcessingLimits({
  limits,
  paymentMethods,
  onLimitChange,
  onPaymentMethodChange
}) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={4}>
          <Iconify icon="mdi:file-chart-outline" width={24} height={24} color="warning.main" />
          <Typography variant="subtitle1" ml={1}>
            Processing Limits & Capabilities
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Minimum Transaction Amount"
              fullWidth
              value={limits.minAmount}
              onChange={(e) => onLimitChange('minAmount', e.target.value)}
              InputProps={{ startAdornment: '$ ' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Maximum Transaction Amount"
              fullWidth
              value={limits.maxAmount}
              onChange={(e) => onLimitChange('maxAmount', e.target.value)}
              InputProps={{ startAdornment: '$ ' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Daily Volume Limit"
              fullWidth
              value={limits.dailyLimit}
              onChange={(e) => onLimitChange('dailyLimit', e.target.value)}
              InputProps={{ startAdornment: '$ ' }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Monthly Volume Limit"
              fullWidth
              value={limits.monthlyLimit}
              onChange={(e) => onLimitChange('monthlyLimit', e.target.value)}
              InputProps={{ startAdornment: '$ ' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Transactions per Minute"
              fullWidth
              value={limits.txPerMinute}
              onChange={(e) => onLimitChange('txPerMinute', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Settlement Period (days)"
              fullWidth
              value={limits.settlementPeriod}
              onChange={(e) => onLimitChange('settlementPeriod', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" mb={1}>
              Supported Payment Methods
            </Typography>
            <FormGroup row>
              {Object.keys(paymentMethods).map((method) => (
                <FormControlLabel
                  key={method}
                  control={
                    <Checkbox
                      checked={paymentMethods[method]}
                      onChange={(e) => onPaymentMethodChange(method, e.target.checked)}
                      name={method}
                    />
                  }
                  label={method.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                />
              ))}
            </FormGroup>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

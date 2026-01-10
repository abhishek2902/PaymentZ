import { Box, Grid } from '@mui/material';
import React from 'react';

export default function ReportingCard({
  tableData = {
    totalTxns: 0,
    successRate: 0,
    failedRate: 0,
    totalVolume: 0,
  },
}) {
  return (
    <>
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f9f9f9' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Box>
              <strong>Total Txns:</strong> {tableData?.totalTxns ?? 0}
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box>
              <strong>Success %:</strong> {tableData?.successRate ?? '0%'}
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box>
              <strong>Failed %:</strong> {tableData?.failedRate ?? '0%'}
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box>
              <strong>Total Volume:</strong> ${tableData?.totalVolume ?? '0.00'}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

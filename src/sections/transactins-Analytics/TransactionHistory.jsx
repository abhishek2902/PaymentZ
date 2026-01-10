import { useState } from 'react';
import {Button,Card,Chip,Divider,InputAdornment,MenuItem,Pagination,Select,Stack,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TextField,Typography} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { toast } from 'sonner';

export default function TransactionHistory({transactions}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleLoginAsMerchant = (id) => {
    toast.success(`Logging in to Admin UI with id = ${id}.`);
    // toast.error('Login Failed. Please try again.');
  }

  const totalTran = transactions.reduce((acc, row) => acc + row.successCount + row.failedCount, 0);

  return (
    <Card sx={{ py: { xs: 0, sm: 2 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" px={2} pb={3} pt={1} spacing={2}>
        
        <Stack direction="row" alignItems="center" spacing={0.5}>
					<Iconify icon="iconamoon:history-bold" width={24} height={24} color="warning.main" />
					<Typography variant="h6" fontWeight="bold" >
						<Stack direction={{ xs: 'row', sm: 'row' }} justifyContent="space-between" alignItems="center" >
							Transaction Count{' '}
							<Chip label={`${totalTran} transactions`} size="small" color="primary" sx={{ ml: 1, fontSize: { xs: '0.65rem', sm: '0.75rem' },px: { xs: 0, sm: 1 }, py: { xs: 0, sm: 0.5 } }} />
						</Stack>
					</Typography>
        </Stack>

        {/* <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Search transactions..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={20} height={20} />
                </InputAdornment>
              ),
            }}
          />
        </Stack> */}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Table */}
      <TableContainer  sx={{px: 2}} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Admin</TableCell>
              <TableCell>Success Amount</TableCell>
              <TableCell>Success Count</TableCell>
              <TableCell>Failed Amount</TableCell>
              <TableCell>Failed Count</TableCell>
              {/* <TableCell>Success Rate</TableCell>
              <TableCell>Failed Rate</TableCell> */}
              {/* <TableCell>One Click Login</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody >
            {transactions.map((tx) => (
              <TableRow key={tx.id }>
                <TableCell align="start">{tx.adminName}</TableCell>
                <TableCell align="center">${tx.successAmount}</TableCell>
                <TableCell align="center">{tx.successCount}</TableCell>
                <TableCell align="center">${tx.failedAmount}</TableCell>
                <TableCell align="center">{tx.failedCount}</TableCell>
                {/* <TableCell align="center">{tx.successRate}</TableCell>
                <TableCell align="center">{tx.failedRate}</TableCell> */}
                {/* <TableCell align="center"><Button variant="outlined" size="small" onClick={() => handleLoginAsMerchant(tx.id)}>Login</Button></TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      {/* <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mt={3}  sx={{px: 2}}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">Showing</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Typography variant="body2">of 18,247 transactions</Typography>
        </Stack>

        <Pagination
          count={1825}
          page={page}
          onChange={(e, value) => setPage(value)}
          shape="rounded"
          color="primary"
        />
      </Stack> */}
    </Card>
  );
}

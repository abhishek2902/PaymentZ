import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ExportTransactions from 'src/layouts/components/export-transactions';

export function ReportTransactionModal({ open, onClose }) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      //   PaperProps={{ sx: { p: 2, borderRadius: 2 } }}
    >
      <DialogTitle>Transaction Report</DialogTitle>
      <DialogContent dividers>
        <ExportTransactions />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

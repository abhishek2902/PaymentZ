import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export function PaymentIframeModal({ open, onClose, iframeHtml }) {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle>Complete Your Payment</DialogTitle>

      <DialogContent dividers>
        {iframeHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: iframeHtml }}
            style={{ width: '100%', height: 'calc(100vh - 180px)' }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

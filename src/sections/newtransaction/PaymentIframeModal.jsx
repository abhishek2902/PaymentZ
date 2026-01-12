import React, { useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export function PaymentIframeModal({ open, onClose, iframeHtml }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (open && iframeHtml && containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Create a wrapper div for better iOS Safari compatibility
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.overflow = 'auto';
      wrapper.style.webkitOverflowScrolling = 'touch';
      
      // Insert the iframe HTML
      wrapper.innerHTML = iframeHtml;
      containerRef.current.appendChild(wrapper);
    }
  }, [open, iframeHtml]);

  return (
    <Dialog 
      fullScreen 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          // iOS Safari specific fixes
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }
      }}
    >
      <DialogTitle>Complete Your Payment</DialogTitle>

      <DialogContent 
        dividers
        sx={{
          padding: 0,
          height: 'calc(100vh - 180px)',
          overflow: 'hidden',
          // iOS Safari specific fixes
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {iframeHtml ? (
          <div
            ref={containerRef}
            style={{ 
              width: '100%', 
              height: '100%',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
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

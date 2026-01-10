import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { jsPDF as JsPDF } from 'jspdf';
import { encode as base64Encode } from 'js-base64';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import {
  Avatar,
  Box,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  TextField,
} from '@mui/material';
import { toast } from 'sonner';
import { capitalizeWords } from 'src/utils/helper';
import { useState } from 'react';
import { CONFIG } from 'src/config-global';
import { verifyMerchantPassword } from 'src/api/merchant';
import autoTable from 'jspdf-autotable';
import { MerchantModal } from './MerchantModal';

// import { useNavigate } from 'react-router';

export function MerchantTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();
  const popover = usePopover();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [merchantPassword, setMerchantPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const merchantModal = useBoolean();
  const collapseRow = useBoolean();
  const navigate = useNavigate();
  const nodeEnv = CONFIG.nodeEnv;
  const merchantDashboardUrl = CONFIG.merchantDashboardUrl;

  const handleDownload = (password) => {
    const doc = new JsPDF();

    // Title and Header
    doc.setFontSize(18);
    doc.text(`${nodeEnv === 'PRODUCTION' ? 'Live' : 'Staging'} Dashboard Credentials`, 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);

    // Description
    doc.text(
      `This PDF contains sensitive ${nodeEnv === 'PRODUCTION' ? 'live' : 'staging'} credentials.`,
      14,
      30
    );

    // Add credentials table
    autoTable(doc, {
      startY: 40,
      theme: 'grid',
      head: [['Key', 'Value']],
      body: [
        ['Merchant Name', row?.businessName],
        ['Merchant ID', row?.id],
        ['Dashboard URL', merchantDashboardUrl],
        ['Username', row?.emailAddress],
        ['Password', password || 'N/A'],
      ],
      styles: {
        cellPadding: 3,
        fontSize: 10,
      },
      headStyles: {
        fillColor: [41, 128, 185],
      },
    });

    // If multiple websites exist
    if (Array.isArray(row?.websites) && row.websites.length > 0) {
      const websiteTableBody = row.websites.map((site) => [
        site.Url || 'N/A',
        (site.description || 'N/A').toUpperCase(), // Convert to UPPERCASE
        site.siteToken || 'N/A',
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        theme: 'striped',
        head: [['Website URL', 'Description', 'Site Token']],
        body: websiteTableBody,
        styles: {
          cellPadding: 3,
          fontSize: 10,
        },
        headStyles: {
          fillColor: [39, 174, 96],
        },
      });
    }

    // Footer Note
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      'Note: After logging into the dashboard, Auth Tokens can be found under the merchant tab.',
      14,
      doc.lastAutoTable.finalY + 10
    );

    // Save PDF
    doc.save(
      `${row?.businessName}_Payments_${nodeEnv === 'PRODUCTION' ? 'Live' : 'Staging'}_Credentials.pdf`
    );
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={popover.open}
      anchorEl={popover.anchorEl}
      onClose={popover.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            setMerchantPassword('');
            setOpenPasswordModal(true);
          }}
        >
          <Iconify icon="eva:cloud-download-fill" />
          Credentials
        </MenuItem>
        <MenuItem onClick={merchantModal.onTrue}>
          <Iconify icon="solar:pen-bold" /> Edit
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  // handle payment
  const handlePayment = (siteToken, paymentName) => {
    const encodedMerchantId = base64Encode(row.id);
    const encodedSiteToken = base64Encode(siteToken);

    // clear local storage
    localStorage.removeItem('merchantId');
    localStorage.removeItem('siteToken');
    localStorage.removeItem('paymentId');

    // redirect vt page
    navigate(
      `/dashboard/newtransaction?mid=${encodedMerchantId}&st=${encodedSiteToken}&paymentGtw=${paymentName}`
    );
  };

  const renderPrimaryRow = () => (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/* <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={collapseRow.value ? 'inherit' : 'default'}
            onClick={collapseRow.onToggle}
            sx={{ ...(collapseRow.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            {/* <Avatar alt={row.name} src={row.avatarUrl} /> */}

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {/* <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}> */}
              {row.clientName}
              {/* </Link> */}
              {/* <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box> */}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.businessName}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.emailAddress}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.total_user}</TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.websites?.length}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.role}</TableCell> */}

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'ACTIVE' && 'success') ||
              (row.status === 'ARCHIVE' && 'error') ||
              'default'
            }
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}
          </Label>
        </TableCell>

        <TableCell>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        {renderMenuActions()}
      </TableRow>

      {/* Download pdf verify Merchant password modal */}
      <Dialog
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Enter Merchant Password</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={merchantPassword}
            onChange={(e) => setMerchantPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    <Iconify icon={showPassword ? 'eva:eye-off-fill' : 'eva:eye-fill'} width={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const result = await verifyMerchantPassword({
                  email: row?.emailAddress,
                  password: merchantPassword,
                });

                if (result?.isVerified) {
                  setOpenPasswordModal(false);
                  handleDownload(merchantPassword);
                } else {
                  toast.error('Incorrect password. Please try again.');
                }
              } catch (error) {
                toast.error('Failed to verify password. Please try again.');
                console.error(error);
              }
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      <MerchantModal currentUser={row} open={merchantModal.value} onClose={merchantModal.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );

  // Render secondary row
  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={12}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row?.websites &&
              row.websites.map((item) => (
                <Box
                  key={item.id}
                  sx={(theme) => ({
                    display: 'flex',

                    alignItems: { xs: 'left', sm: 'left' },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    p: theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: `solid 2px ${theme.vars.palette.background.neutral}`,
                    },
                  })}
                >
                  <Box sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                    <ListItemText
                      primary={item?.Url}
                      secondary={capitalizeWords(item?.paymentName)}
                      slotProps={{
                        primary: {
                          sx: { typography: 'body2' },
                        },
                        secondary: {
                          sx: { mt: 0.5, color: 'text.disabled' },
                        },
                      }}
                    />
                    <Label
                      variant="soft"
                      color={item.paymentStatus === 'ACTIVE' ? 'success' : 'error'}
                    >
                      {capitalizeWords(item?.paymentStatus)}
                    </Label>
                  </Box>

                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={item.paymentStatus !== 'ACTIVE'}
                    onClick={() => handlePayment(item?.siteToken, item?.paymentName)}
                    sx={{ width: { xs: '180px', sm: '180px' }, mt: { xs: 1, sm: 0 } }}
                  >
                    Create Transaction
                  </Button>
                </Box>
              ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );
  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}
    </>
  );
}

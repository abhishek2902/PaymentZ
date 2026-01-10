import { useState } from 'react';
import { toast } from 'sonner';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { jsPDF as JsPDF } from 'jspdf';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import autoTable from 'jspdf-autotable';
import { CONFIG } from 'src/config-global';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { capitalizeWords } from 'src/utils/helper';
import { fDateTime } from 'src/utils/format-time';
import { verifyMerchantPassword } from 'src/api/merchant';
import { SiteModal } from './SiteModal';

export function SiteTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [merchantPassword, setMerchantPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const popover = usePopover();
  const nodeEnv = CONFIG.nodeEnv;
  const merchantDashboardUrl = CONFIG.merchantDashboardUrl;

  const sitesModal = useBoolean();

  // handle download pdf

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
        ['Sitetoken', row?.siteToken],
        ['Merchant ID', row?.merchantId],
        ['Dashboard URL', merchantDashboardUrl],
        ['Username', row?.merchantEmailAddress],
        ['Password', password || 'N/A'], // Dynamic password here
      ],
      styles: {
        cellPadding: 3,
        fontSize: 10,
      },
      headStyles: {
        fillColor: [41, 128, 185], // professional blue
      },
    });

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

        <MenuItem onClick={sitesModal.onTrue}>
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.businessName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.siteUrl}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {capitalizeWords(row?.paymentGatewayName)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(row.createdDate)}</TableCell>

        <TableCell>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      {/* Password Modal */}
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
                  email: row?.merchantEmailAddress,
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

      {renderMenuActions()}
      <SiteModal open={sitesModal.value} onClose={sitesModal.onFalse} currentUser={row} />
    </>
  );
}

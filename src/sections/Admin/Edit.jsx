// src/sections/connector/Edit.jsx

import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import AdminEditPage from './AdminEdit/AdminEditPage';

export const AdminMock = {
  id: "MRC-001",
  name: "Alpha Fintech Pvt. Ltd.",
  status: "Active",

  pricing: {
    mdrDomestic: "2.3%",
    mdrInternational: "3.8%",
    successFee: "$0.25",
    rollingReserve: "5%",
    settlementFee: "$10 per batch",
    payoutTerms: "T+2 Days",
    chargebackFee: "$20 per case",
    refundFee: "$5 per refund",
  },

  bank: {
    bankName: "HDFC Bank",
    accountHolder: "Alpha Fintech Pvt. Ltd.",
    accountNumber: "123456789012",
    routingNumber: "HDFC0001234",
    accountType: "Current",
    currency: "USD",
    swift: "HDFCINBBXXX",
    bankAddress: "123, Business Bay, Mumbai, India",
  },

  backupBank: {
    bankName: "ICICI Bank",
    accountNumber: "987654321098",
  },

  crypto: {
    network: "Ethereum",
    walletAddress: "0x4bE1A2F4c7A1cB0bD7F5dA87bB9b1bA901234567",
  },

  preferences: {
    primaryPaymentMethod: "Bank Transfer",
    timezone: "Asia/Kolkata",
    paymentFrequency: "Weekly",
    payoutThreshold: "$500",
  },

  backup: {
    email: "support@alphafintech.com",
    phone: "+91 9876543210",
  },
};

export function Edit() {

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Admin Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Admin  Management', href: paths.dashboard.admin },
          { name: 'Edit', href: paths.dashboard.adminEdit }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AdminEditPage currentData={AdminMock}/>

    </DashboardContent>
  );
}
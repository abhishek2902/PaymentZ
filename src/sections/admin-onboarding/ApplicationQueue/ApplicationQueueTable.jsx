import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import RejectModal from "../PriorityApplications/RejectModal";
import { ApplicationModal } from "../PriorityApplications/ApplicationModel";

// ✅ Main component with new data integration + old UI
export default function ApplicationQueueTable({ data, isLoading, isError, filters, setFilters }) {

  // Modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  // Handle modals
  const handleView = (row) => {
    setSelectedApp(row);
    setOpenView(true);
  };
  const handleReject = (row) => {
    setSelectedApp(row);
    setOpenReject(true);
  };

  // Utility for Avatar initials
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "under review":
      case "approval_pending":
      case "new":
        return "success";
      case "kyc_pending":
        return "warning";
      case "active":
        return "info";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  // Risk color mapping (placeholder since backend may not send risk)
  const getRiskColor = (risk) => {
    switch ((risk || "").toLowerCase()) {
      case "low":
        return "success.main";
      case "medium":
        return "warning.main";
      case "high":
        return "error.main";
      default:
        return "text.secondary";
    }
  };

  // Transform backend data for table
  const applications =
    data?.data?.content?.map((item) => {
      const company = item.companies?.[0];
      const address = company?.companyAddress;
      const processReq = item.subscriptionProcessRequirement;
      const attachmentMap = Object.fromEntries(
        (company?.attachments || []).map((att) => [att.documentType, att.filePath])
      );

      return {
        id: item.id,
        uuid: company?.uuid,
        fullname:`${item.firstName} ${item.lastName}`,
        name: company?.name || `${item.firstName} ${item.lastName}`,
        status: item.commonStatus?.toLowerCase() || "neww",

        pricingAndFees: {
          mdrRateDomestic: company?.mdrRateDomestic || "N/A",
          mdrRateInternational: company?.mdrRateInternational || "N/A",
          successFeePerTransaction: company?.successFeePerTransaction || "N/A",
          rollingReserveRate: company?.rollingReserveRate || "N/A",
          settlementFee: company?.settlementFee || "N/A",
          payoutTerms: company?.payoutTerms || "N/A",
          chargebackFee: company?.chargebackFee || "N/A",
          refundFee: company?.refundFee || "N/A",
        },

        // 🏷️ Tags
        tags: [
          { label: item.commonStatus || "Neww", color: "success" },
          // { label: processReq?.annualProcessingVolume || "Unknown Volume", color: "primary" },
        ],

        // 🏢 Business / Company Info
        businessType: company?.industryType || "N/A",
        submitted: new Date(item.createdAt).toLocaleDateString(),
        riskScore: "Medium (42)", // placeholder (add actual logic if available)
        estVolume: processReq?.annualProcessingVolume
          ? `$${processReq.annualProcessingVolume}`
          : "-",
        // sla: "2 hours remaining", // static or compute dynamically if needed
        contact: `${item.firstName} ${item.lastName} - ${item.email}`,

        // 🎨 Card color
        cardColor:
          item.onBoardingStatus === "NEW"
            ? "#fffde7"
            : item.onBoardingStatus === "APPROVED"
            ? "#e8f5e9"
            : "#ffebee",

        // 🧍 Personal Information
        personalInfo: {
          fullName: `${item.firstName} ${item.lastName}`,
          email: item.email,
          phone: item.phoneNumber || "-",
          position: item.positionTitle || "-",
        },

        // 🏢 Company Information
        companyInfo: {
          companyName: company?.name || "-",
          registrationNumber: company?.businessRegNumber || "-",
          industry: company?.industryType || "-",
          website: company?.website || "-",
          companySize: company?.companySize || "-",
          year: company?.businessYears || "-",
          address: address
            ? `${address.street1}, ${address.city}, ${address.state}, ${address.country}, ${address.postcode}`
            : "-",
          description: company?.description || "-",
        },

        // 🏢 Bank Information
        bankAccountDetails: {
          bankName: company?.bankAccountDetails?.bankName || "-",
          accountHolderName: company?.bankAccountDetails?.accountHolderName || "-",
          accountNumber: company?.bankAccountDetails?.accountNumber || "-",
          routingNumber: company?.bankAccountDetails?.routingNumber || "-",
          accountType: company?.bankAccountDetails?.accountType || "-",
          currency: company?.bankAccountDetails?.currency || "-",
          swiftBic: company?.bankAccountDetails?.swiftBic || "-",
          bankAddress: company?.bankAccountDetails?.bankAddress || "-",
        },

        crypto: {
          network:company?.network || "-",
          walletAddress:company?.walletAddress || "-",
          walletControlConfirmed:item.walletControlConfirmed || false,
        },

        backupEmailMobile: {
          backupEmail:item.backupEmail || "-",
          emergencyPhone:item.emergencyPhone || "-",
        },

        paymentPreferenceAndSetting: {
          primaryPaymentMethod:item.primaryPaymentMethod || "-",
          timeZone:item.timeZone || "-",
          paymentFrequency:item.paymentFrequency || "-",
        },

        // 💳 Processing Requirements
        processingRequirements: {
          expectedAnnualVolume: processReq?.annualProcessingVolume || "-",
          avgTransactionSize: processReq?.avgTransactionSize
            ? `$${processReq.avgTransactionSize}`
            : "-",
          pricingAndFees: {
            mdrDomestic: "-",
            mdrInternational: "-",
            successFee: "-",
            rollingReserve: "-",
            settlementFee: "-",
            payoutTerms: "-",
            chargebackFee: "-",
            refundFee: "-",
          },
        },

         documents: {
          govId: attachmentMap.IDENTITY_PROOF || null,
          addressProof: attachmentMap.ADDRESS_PROOF || null,
          businessRegistration: attachmentMap.CERTIFICATE || null,
          taxId: attachmentMap.TAX_DOCUMENT || null,
          businessLicense: attachmentMap.LICENSE || null,
          articlesOfIncorporation: attachmentMap.CONTRACT || null,
          bankStatements: attachmentMap.BANK_STATEMENT || null,
          financialStatement: attachmentMap.FINANCIAL_STATEMENT || null,
          processingHistory: attachmentMap.PROCESSING_HISTORY || null,
          otherSupportingDocuments: attachmentMap.OTHER || null,
          certificate: attachmentMap.CERTIFICATE || null,
          contract: attachmentMap.CONTRACT || null,
        },

        // 🧭 Actions
        actions: [
          { label: "Review", color: "primary", icon: "mdi:eye" },
          { label: "Reject", color: "inherit", icon: "mdi:file-document-edit" },
        ],
      };
    }) || [];

  // Loading / error states
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" align="center">
        {/* Failed to load applications */}
      </Typography>
    );

    // Handle table pagination (server-side)
  const handlePageChange = (newPage) => {
    setFilters((f) => ({ ...f, page: newPage }));
  };

  const handleStatusChange = (status) => {
    setFilters((f) => ({
      ...f,
      status: status === "All Status" ? null : status.toUpperCase(),
      page: 0,
    }));
  };

  const paginatedData = applications;

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, px: 0, height: "100%" }}>
      {/* Header */}
      <Box sx={{ pb: 1, m: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'end' }}
          sx={{ px: 0, pt: 0 }}
        >
          <CardHeader
            title="Application Queue"
            subheader="All pending applications"
            titleTypographyProps={{ variant: "h6" }}
          />

          {/* Filters */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ mt: 0, px: 2, pt: 1 }}
          >
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <Select
                value={filters.status || "All Status"}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="NEW">New</MenuItem>
                <MenuItem value="KYC_PENDING">KYC Pending</MenuItem>
                {/* <MenuItem value="ACTIVE">Active</MenuItem> */}
                <MenuItem value="APPROVAL_PENDING">Approval Pending</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Box>

      {/* Table */}
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>BUSINESS TYPE</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>SUBMITTED</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>RISK</TableCell> */}
                <TableCell sx={{ fontWeight: "bold" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {/* <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "grey.300",
                          fontSize: 14,
                        }}
                      >
                        {getInitials(app.name)}
                      </Avatar> */}
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {app.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {app.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={app.businessType}
                      size="small"
                      sx={{
                        borderRadius: "6px",
                        bgcolor: "primary.light",
                        height: 18,
                        fontSize: '0.6rem',
                        padding: '0 4px',
                        '& .MuiChip-label': {
                          px: 0.1,
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {app.submitted}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {app.daysAgo}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={app.status?.toUpperCase()}
                      size="small"
                      color={getStatusColor(app.status)}
                       sx={{
                        borderRadius: "6px",
                        height: 18,
                        fontSize: '0.6rem',
                        padding: '0 4px',
                        '& .MuiChip-label': {
                          px: 0.1,
                        }
                      }}
                      variant="outlined"
                    />
                  </TableCell>

                  {/* <TableCell>
                    <Chip
                      label={app.risk}
                      size="small"
                      sx={{
                        borderRadius: "6px",
                        bgcolor: getRiskColor(app.risk),
                        color: "white",
                      }}
                    />
                  </TableCell> */}

                  <TableCell>
                    <Stack direction="row" spacing={0}>

                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          sx={{ color: "success.main" }}
                          onClick={() => handleView(app)}
                        >
                          <Icon icon="mdi:check-circle" style={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          sx={{ color: "error.main" }}
                          onClick={() => handleReject(app)}
                        >
                          <Icon icon="mdi:close-circle" style={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination summary + buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            p: 2,
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filters.page * filters.size + 1}-
            {Math.min((filters.page + 1) * filters.size, data?.data?.totalElements || 0)}
            {" "}of {data?.data?.totalElements || 0} applications
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              disabled={filters.page === 0}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              Previous
            </Button>

            <Button size="small" variant="contained">
              {filters.page + 1}
            </Button>

            {(filters.page + 1) * filters.size < (data?.data?.totalElements || 0) && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </Button>
            )}
          </Stack>
        </Box>

      </CardContent>

      {/* Modals */}
      <ApplicationModal
        open={openView}
        onClose={() => setOpenView(false)}
        currentData={selectedApp}
      />
      <RejectModal
        open={openReject}
        onClose={() => setOpenReject(false)}
        currentData={selectedApp}
        name={selectedApp?.fullname}
      />
    </Card>
  );
}

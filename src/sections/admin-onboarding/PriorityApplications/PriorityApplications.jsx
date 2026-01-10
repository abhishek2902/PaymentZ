import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { useBoolean } from "src/hooks/use-boolean";
import { Icon } from "@iconify/react";
import { ApplicationModal } from "./ApplicationModel";
import RejectModal from "./RejectModal";

export default function PriorityApplications({data, isLoading, isError, filters, setFilters}) {
  const applicationModel = useBoolean();
  const rejectModel = useBoolean();

  const [selectedApplication, setSelectedApplication] = useState(null);

  if (isLoading) {
    return <Typography>Loading applications...</Typography>;
  }

  if (isError) {
    return <Typography color="error">Failed to onboarding list.</Typography>;
  }

  // 🟣 3. Transform API data (if needed)
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
          primaryPaymentMethod:company?.primaryPaymentMethod || "-",
          timeZone:item.timeZone || "-",
          paymentFrequency:company?.paymentFrequency || "-",
        },

        // 💳 Processing Requirements
        processingRequirements: {
          monthlyProcessingVolume: item?.monthlyProcessingVolume || "-",
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

  const paginatedApps = applications;

  const handleReview = (app) => {
    setSelectedApplication(app);
    applicationModel.onTrue(); // open modal
  };

  const handleReject = (app) => {
    setSelectedApplication(app);
    rejectModel.onTrue(); // open modal
  };

  const handleRejectSubmit = async (dat) => {
    try {
      // await axios.post(`/api/merchant/${merchantId}/reject`, data);
      rejectModel.onFalse();
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

    // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
      {/* Header */}
			<Stack
				direction={{ xs: "column", sm: "row" }} // column on mobile, row on larger screens
				justifyContent="space-between"
				alignItems={{ xs: "flex-start", sm: "center" }}
				spacing={2}
				sx={{ mb: 2 }}
			>
				{/* Title + Subtitle */}
				<Box sx={{ px: 2 }}>
					<Typography variant="h6" fontWeight={600}>
						Priority Applications Requiring Immediate Attention
					</Typography>
					{/* <Typography variant="body2" color="text.secondary">
						High-priority applications that need urgent review
					</Typography> */}
				</Box>
			</Stack>

      {/* Application List */}
      <Stack spacing={2}>
        {paginatedApps.map((app) => (
          <Card
            key={app.id}
            variant="outlined"
            sx={{
              borderRadius: 2,
              bgcolor: app.cardColor,
              border: "1px solid #ddd",
            }}
          >
            <CardContent>
              {/* Title and Tags */}
              <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={1} mb={1}>
                <Icon
                  icon="mdi:office-building"
                  fontSize={24}
                  style={{ color: "#555" }}
                />
                <Typography variant="subtitle1" fontWeight={600}>
                  {app.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {/* {app.tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag.label}
                      color={tag.color}
                      size="small"
                    />
                  ))} */}
                    <Chip
                      // key={i}
                      label={app.status?.toUpperCase()}
                      color={getStatusColor(app.status)}
                      size="small"
                    />
                </Stack>
              </Stack>

              {/* Description */}
              <Typography variant="body2" color="text.secondary" mb={1.5}>
                {app.companyInfo?.description}
              </Typography>

              {/* Info Grid */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                divider={<Divider orientation="vertical" flexItem />}
                mb={1.5}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Business Type:
                  </Typography>
                  <Typography variant="body2">{app.businessType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Submitted:
                  </Typography>
                  <Typography variant="body2">{app.submitted}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Risk Score:
                  </Typography>
                  <Typography variant="body2">{app.riskScore}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Est. Volume:
                  </Typography>
                  <Typography variant="body2">{app.estVolume}</Typography>
                </Box>
              </Stack>

              {/* SLA + Contact */}
              {/* <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                <Icon icon="mdi:clock-outline" style={{ marginRight: 4 }} />
                {app.sla}
              </Typography> */}
              <Typography variant="body2" color="text.secondary">
                <Icon
                  icon="mdi:account-circle"
                  style={{ marginRight: 4 }}
                />
                {app.contact}
              </Typography>

              {/* Actions */}
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Icon icon="mdi:eye" />}
                  size="small"
                  onClick={() => handleReview(app)}
                >
                  Review
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  // startIcon={<Icon icon="mdi:file-document-edit" />}
                  size="small"
                  onClick={() => handleReject(app)}
                >
                  Reject
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

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

      <ApplicationModal
        open={applicationModel.value}
        onClose={applicationModel.onFalse}
        currentData={selectedApplication}
      />
      <RejectModal
        open={rejectModel.value}
        onClose={rejectModel.onFalse}
        onSubmit={handleRejectSubmit}
        name={selectedApplication?.fullname}
        currentData={selectedApplication}
      />
    </Card>
  );
}

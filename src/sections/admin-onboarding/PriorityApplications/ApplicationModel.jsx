// src/sections/application/ApplicationModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { approveApplication, approveApplication2 } from "src/api/onboarding";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { Form } from "src/components/hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "src/components/snackbar";
import DocumentField from "./DocumentField";

// Example API
// import { updateApplication } from "src/api/application";

const ApplicationSchema = zod.object({
  // mdrRateDomestic: zod.string().min(1, "Required"),
  // mdrRateInternational: zod.string().min(1, "Required"),
  // successFeePerTransaction: zod.string().min(1, "Required"),
  // rollingReserveRate: zod.string().min(1, "Required"),
  // settlementFee: zod.string().min(1, "Required"),
  // payoutTerms: zod.string().min(1, "Required"),
  // chargebackFee: zod.string().min(1, "Required"),
  // refundFee: zod.string().min(1, "Required"),
});

export function ApplicationModal({ open, onClose, currentData }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const isApprovalPending = currentData?.status?.toLowerCase() === "approval_pending";

  const methods = useForm({
    mode: "onChange",
    // resolver: zodResolver(ApplicationSchema),
    resolver: isApprovalPending ? undefined : zodResolver(ApplicationSchema),
    defaultValues: {
      mdrRateDomestic: "0",
      mdrRateInternational: "0",
      successFeePerTransaction: "0",
      rollingReserveRate: "0",
      settlementFee: "0",
      payoutTerms: "0",
      chargebackFee: "0",
      refundFee: "0",
    },
  }); 

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const approveMutation = useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      toast.success("Step1 approved successfully");
      queryClient.invalidateQueries(["applications"]);
      onClose();
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || "Failed to approve application");
    },
  });

  const approveMutation2 = useMutation({
    mutationFn: approveApplication2,
    onSuccess: () => {
      toast.success("Step2 approved successfully");
      queryClient.invalidateQueries(["applications"]);
      setLoading(false);
      onClose();
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || "Failed to approve application");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = {
      userId: currentData?.id,
      ...data, // includes all pricing fields
    };

    // approveMutation.mutate(payload);
    if (currentData?.status?.toLowerCase() === "new") {
      // Step 1 approval
      approveMutation.mutate(payload);
    } else {
      // Step 2 approval — also include email
      const payloadWithEmail = {
        email: currentData?.personalInfo?.email, // send email from frontend
        uuid: currentData?.uuid,
      };
      approveMutation2.mutate(payloadWithEmail);
    }
  });

  // reusable style
  const readonlyFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f5f5f5",
      "& fieldset": { borderColor: "#ddd" },
      "&:hover fieldset, &.Mui-focused fieldset": { borderColor: "#ddd" },
    },
    "& .MuiInputLabel-root": { color: "text.secondary" },
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Application Review</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {/* Read-only Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
              <TextField label="Full Name" value={currentData?.personalInfo?.fullName || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField label="Email" value={currentData?.personalInfo?.email || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField label="Phone" value={currentData?.personalInfo?.phone || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField label="Position/Title" value={currentData?.personalInfo?.position || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
              <TextField label="Company Name" value={currentData?.companyInfo?.companyName || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField
                label="Business Registration Number"
                value={currentData?.companyInfo?.registrationNumber || ""}
                InputProps={{ readOnly: true }}
                sx={readonlyFieldSx}
              />
              <TextField label="Industry/Type" value={currentData?.companyInfo?.industry || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField label="Company Website" value={currentData?.companyInfo?.website || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField label="Company Size" value={currentData?.companyInfo?.companySize || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField label="Year of Business" value={currentData?.companyInfo?.year || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              <TextField
                label="Company Address"
                value={currentData?.companyInfo?.address || ""}
                InputProps={{ readOnly: true }}
                sx={readonlyFieldSx}
              />
              <TextField
                label="Business Description"
                value={currentData?.companyInfo?.description || ""}
                InputProps={{ readOnly: true }}
                multiline
                minRows={2}
                sx={readonlyFieldSx}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Processing Requirements
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
              <TextField
                label="Expected Monthly Processing Volume"
                value={currentData?.processingRequirements?.monthlyProcessingVolume || ""}
                InputProps={{ readOnly: true }}
                sx={readonlyFieldSx}
              />
              {/* <TextField
                label="Average Transaction Size (in $)"
                value={currentData?.processingRequirements?.avgTransactionSize || ""}
                InputProps={{ readOnly: true }}
                sx={readonlyFieldSx}
              /> */}
            </Box>
          </Box>

          {/* Editable Pricing Fields */}
          {/* {currentData?.status === "new"?
            <Box>
              <Typography variant="h6" gutterBottom>
                Pricing & Fee Structure{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.secondary", fontStyle: "italic" }}
                >
                  (to be filled by admin)
                </Typography>
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <TextField name="mdrDomestic" label="MDR Rate (Domestic)" {...methods.register("mdrRateDomestic")} />
                <TextField name="mdrInternational" label="MDR Rate (International)" {...methods.register("mdrRateInternational")} />
                <TextField name="successFee" label="Success Fee (Per transaction)" {...methods.register("successFeePerTransaction")} />
                <TextField name="rollingReserve" label="Rolling Reserve Rate" {...methods.register("rollingReserveRate")} />
                <TextField name="settlementFee" label="Settlement Fee" {...methods.register("settlementFee")} />
                <TextField name="payoutTerms" label="Payout Terms" {...methods.register("payoutTerms")} />
                <TextField name="chargebackFee" label="Chargeback Fee" {...methods.register("chargebackFee")} />
                <TextField name="refundFee" label="Refund Fee" {...methods.register("refundFee")} />
              </Box>
            </Box>
            :
            <Box>
              <Typography variant="h6" gutterBottom>
                Pricing & Fee Structure
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <TextField name="mdrDomestic" label="MDR Rate (Domestic)"  value={currentData?.pricingAndFees?.mdrRateDomestic || ""} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={readonlyFieldSx} />
                <TextField name="mdrInternational" label="MDR Rate (International)" value={currentData?.pricingAndFees?.mdrRateInternational || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField name="successFee" label="Success Fee (Per transaction)" value={currentData?.pricingAndFees?.successFeePerTransaction || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField name="rollingReserve" label="Rolling Reserve Rate" value={currentData?.pricingAndFees?.rollingReserveRate || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField name="settlementFee" label="Settlement Fee" value={currentData?.pricingAndFees?.settlementFee || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField name="payoutTerms" label="Payout Terms"  value={currentData?.pricingAndFees?.payoutTerms || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField name="chargebackFee" label="Chargeback Fee"  value={currentData?.pricingAndFees?.chargebackFee || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField name="refundFee" label="Refund Fee"  value={currentData?.pricingAndFees?.refundFee || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
              </Box>
            </Box>
          } */}

          {/* UnEditable step2 Fields */}
          {(currentData?.status === "active" || currentData?.status === "approval_pending" || currentData?.status === "rejected") &&<>
            <Box sx={{ py: 3 }}>
              <Typography variant="h6" gutterBottom >
                Primary Bank Account
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <TextField label="Bank Name" value={currentData?.bankAccountDetails?.bankName || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Account Holder Name" value={currentData?.bankAccountDetails?.accountHolderName || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Account Number" value={currentData?.bankAccountDetails?.accountNumber || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Routing Number" value={currentData?.bankAccountDetails?.routingNumber || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Account Type" value={currentData?.bankAccountDetails?.accountType || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Currency" value={currentData?.bankAccountDetails?.currency || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="SWIFT/BIC" value={currentData?.bankAccountDetails?.swiftBic || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Bank Address" value={currentData?.bankAccountDetails?.bankAddress || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
              </Box>
            </Box>
            {/* <Box sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom >
                Backup Bank Account
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <TextField label="Bank Name" value={currentData?.personalInfo?.fullName || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
                <TextField label="Account Holder Name" value={currentData?.personalInfo?.email || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
                <TextField label="Account Number" value={currentData?.personalInfo?.phone || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
                <TextField label="Routing Number" value={currentData?.personalInfo?.position || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
                <TextField label="Account Type" value={currentData?.personalInfo?.position || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
                <TextField label="Currency" value={currentData?.personalInfo?.position || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
                <TextField label="SWIFT/BIC" value={currentData?.personalInfo?.position || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
                <TextField label="Bank Address" value={currentData?.personalInfo?.position || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx}/>
              </Box>
            </Box> */}
            <Box sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom >
                Cryptocurrency Wallets
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <TextField label="Network" value={currentData?.crypto?.network || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Wallet Address" value={currentData?.crypto?.walletAddress || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
              </Box>
            </Box>

            <Box sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom >
                Payment Preferences & Settings
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <TextField label="Primary Payment Method" value={currentData?.paymentPreferenceAndSetting?.primaryPaymentMethod || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Time zone" value={currentData?.paymentPreferenceAndSetting?.timeZone || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Payment Frequency" value={currentData?.paymentPreferenceAndSetting?.paymentFrequency || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                {/* <TextField label="Minimum Payout Threshold" value={currentData?.personalInfo?.email || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/> */}
              </Box>
            </Box>

            <Box sx={{ pb: 3 }}>
              <Typography variant="h6" gutterBottom >
                Backup Email and Emergency Contact  
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <TextField label="Backup Contact Email" value={currentData?.backupEmailMobile?.backupEmail || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
                <TextField label="Emergency Contact Phone" value={currentData?.backupEmailMobile?.emergencyPhone || ""} InputProps={{ readOnly: true }} sx={readonlyFieldSx} InputLabelProps={{ shrink: true }}/>
              </Box>
            </Box>
            </>
          }

          {(currentData?.status === "active" || currentData?.status === "approval_pending" || currentData?.status === "rejected") &&<>

            <Box sx={{ py: 3 }}>
              <Typography variant="h6" gutterBottom>
                Identity Verification Documents
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                <DocumentField
                  label="Government Issued ID / Passport"
                  filePath={currentData?.documents?.govId}
                  fileName="Government_ID"
                />

                <DocumentField
                  label="Proof of Address"
                  filePath={currentData?.documents?.addressProof}
                  fileName="Proof_of_Address"
                />
              </Box>
            </Box>

            <Box sx={{ py: 3 }}>
              <Typography variant="h6" gutterBottom >
                Business Verification Documents
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <DocumentField label="Business Registration Certificate" filePath={currentData?.documents?.businessRegistration} fileName="Business_Registration_ID"/>
                <DocumentField label="Tax Identification Document" filePath={currentData?.documents?.taxId} fileName="Tax_Identification_ID"/>
                <DocumentField label="Business License (if applicable)" filePath={currentData?.documents?.businessLicense} fileName="Business_License"/>
                <DocumentField label="Articles of Incorporation" filePath={currentData?.documents?.articlesOfIncorporation} fileName="Articles_of_Incorporation"/>
              </Box>
            </Box>
            <Box sx={{ py: 3 }}>
              <Typography variant="h6" gutterBottom >
                Financial Documents
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <DocumentField label="Bank Statements (last 3 months) " filePath={currentData?.documents?.bankStatements} fileName="Bank_Statements"/>
                <DocumentField label="Financial Statement" filePath={currentData?.documents?.financialStatement} fileName="Financial_Statement"/>
              </Box>
            </Box>
            <Box sx={{ py: 3 }}>
              <Typography variant="h6" gutterBottom >
                Additional Documents
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                <DocumentField label="Processing History (if available)" filePath={currentData?.documents?.processingHistory} fileName="Processing_History"/>
                <DocumentField label="Other Supporting Documents" filePath={currentData?.documents?.otherSupportingDocuments} fileName="Other_Supporting_Documents"/>
              </Box>
            </Box>
            </>
          }
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {loading ? <CircularProgress size={18} /> : "Approve"}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

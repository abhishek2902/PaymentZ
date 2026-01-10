// src/sections/Admin/AdminEditPage.jsx
import { Card, CardContent, Typography, Box, Button, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "src/components/snackbar";
import AdminFieldGroup from "./AdminFieldGroup";

// ✅ Validation schema
const AdminSchema = zod.object({
  mdrDomestic: zod.string().min(1, "Required"),
  mdrInternational: zod.string().min(1, "Required"),
  successFee: zod.string().min(1, "Required"),
  rollingReserve: zod.string().min(1, "Required"),
  settlementFee: zod.string().min(1, "Required"),
  payoutTerms: zod.string().min(1, "Required"),
  chargebackFee: zod.string().min(1, "Required"),
  refundFee: zod.string().min(1, "Required"),

  bankName: zod.string().min(1, "Required"),
  accountHolder: zod.string().min(1, "Required"),
  accountNumber: zod.string().min(1, "Required"),
  routingNumber: zod.string().min(1, "Required"),
  accountType: zod.string().min(1, "Required"),
  currency: zod.string().min(1, "Required"),
  swift: zod.string().min(1, "Required"),
  bankAddress: zod.string().min(1, "Required"),

  backupBankName: zod.string().optional(),
  backupAccountNumber: zod.string().optional(),

  cryptoNetwork: zod.string().optional(),
  walletAddress: zod.string().optional(),

  primaryPaymentMethod: zod.string().optional(),
  timezone: zod.string().optional(),
  paymentFrequency: zod.string().optional(),
  payoutThreshold: zod.string().optional(),

  backupEmail: zod.string().optional(),
  emergencyPhone: zod.string().optional(),
});

export default function AdminEditPage({ currentData }) {

  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(AdminSchema),
    mode: "onChange",
    defaultValues: {
      // pricing
      mdrDomestic: currentData?.pricing?.mdrDomestic || "",
      mdrInternational: currentData?.pricing?.mdrInternational || "",
      successFee: currentData?.pricing?.successFee || "",
      rollingReserve: currentData?.pricing?.rollingReserve || "",
      settlementFee: currentData?.pricing?.settlementFee || "",
      payoutTerms: currentData?.pricing?.payoutTerms || "",
      chargebackFee: currentData?.pricing?.chargebackFee || "",
      refundFee: currentData?.pricing?.refundFee || "",

      // bank
      bankName: currentData?.bank?.bankName || "",
      accountHolder: currentData?.bank?.accountHolder || "",
      accountNumber: currentData?.bank?.accountNumber || "",
      routingNumber: currentData?.bank?.routingNumber || "",
      accountType: currentData?.bank?.accountType || "",
      currency: currentData?.bank?.currency || "",
      swift: currentData?.bank?.swift || "",
      bankAddress: currentData?.bank?.bankAddress || "",

      // backup bank
      backupBankName: currentData?.backupBank?.bankName || "",
      backupAccountNumber: currentData?.backupBank?.accountNumber || "",

      // crypto
      cryptoNetwork: currentData?.crypto?.network || "",
      walletAddress: currentData?.crypto?.walletAddress || "",

      // preferences
      primaryPaymentMethod: currentData?.preferences?.primaryPaymentMethod || "",
      timezone: currentData?.preferences?.timezone || "",
      paymentFrequency: currentData?.preferences?.paymentFrequency || "",
      payoutThreshold: currentData?.preferences?.payoutThreshold || "",

      // contact
      backupEmail: currentData?.backup?.email || "",
      emergencyPhone: currentData?.backup?.phone || "",
    },
  });

  const { handleSubmit, register, formState } = methods;

  // ✅ API call simulation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      console.log("Send to Admin for review:", data);
      await new Promise((res) => setTimeout(res, 1200));
    },
    onSuccess: () => toast.success("Rates sent to Admin for review"),
    onError: () => toast.error("Failed to send rates"),
  });

  const onSubmit = handleSubmit((data) => updateMutation.mutate(data));

  return (
      <Card sx={{ mt: 0, py: 2 }}>
        <CardContent>

          {/* Pricing */}
          <AdminFieldGroup
            title="Pricing & Fee Structure"
            register={register}
            values={currentData?.pricing}
            fields={[
              { name: "mdrDomestic", label: "MDR Rate (Domestic)" },
              { name: "mdrInternational", label: "MDR Rate (International)" },
              { name: "successFee", label: "Success Fee (Per transaction)" },
              { name: "rollingReserve", label: "Rolling Reserve Rate" },
              { name: "settlementFee", label: "Settlement Fee" },
              { name: "payoutTerms", label: "Payout Terms" },
              { name: "chargebackFee", label: "Chargeback Fee" },
              { name: "refundFee", label: "Refund Fee" },
            ]}
          />

          {/* Bank Details */}
          <AdminFieldGroup
            title="Primary Bank Account"
            register={register}
            values={currentData?.bank}
            fields={[
              { name: "bankName", label: "Bank Name" },
              { name: "accountHolder", label: "Account Holder Name" },
              { name: "accountNumber", label: "Account Number" },
              { name: "routingNumber", label: "Routing Number" },
              { name: "accountType", label: "Account Type" },
              { name: "currency", label: "Currency" },
              { name: "swift", label: "SWIFT/BIC" },
              { name: "bankAddress", label: "Bank Address", multiline: true },
            ]}
          />

          {/* Backup Bank */}
          <AdminFieldGroup
            title="Backup Bank Account"
            register={register}
            values={currentData?.backupBank}
            fields={[
              { name: "backupBankName", label: "Bank Name" },
              { name: "backupAccountNumber", label: "Account Number" },
            ]}
          />

          {/* Crypto */}
          <AdminFieldGroup
            title="Cryptocurrency Wallets"
            register={register}
            values={currentData?.crypto}
            fields={[
              { name: "cryptoNetwork", label: "Network" },
              { name: "walletAddress", label: "Wallet Address", multiline: true },
            ]}
          />

          {/* Payment Preferences */}
          <AdminFieldGroup
            title="Payment Preferences & Settings"
            register={register}
            values={currentData?.preferences}
            fields={[
              { name: "primaryPaymentMethod", label: "Primary Payment Method" },
              { name: "timezone", label: "Time Zone" },
              { name: "paymentFrequency", label: "Payment Frequency" },
              { name: "payoutThreshold", label: "Minimum Payout Threshold" },
            ]}
          />

          {/* Backup Contact */}
          <AdminFieldGroup
            title="Backup Email & Emergency Contact"
            register={register}
            values={currentData?.backup}
            fields={[
              { name: "backupEmail", label: "Backup Contact Email" },
              { name: "emergencyPhone", label: "Emergency Contact Phone" },
            ]}
          />

          {/* Action Buttons */}
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
            <Button variant="outlined" color="inherit" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              startIcon={<Icon icon="mdi:send-check-outline" />}
              loading={formState.isSubmitting || updateMutation.isPending}
              onClick={onSubmit}
            >
              Send Rates to Admin for Review
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
  );
}
import { Box, Button, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Form } from "src/components/hook-form";
import AdminFieldGroup from "./AdminFieldGroup";

export default function AdminFormStep({
  methods,
  onSubmit,
  isSubmitting,
  currentData,
  onCancel,
}) {
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ p: 2 }}>
        <AdminFieldGroup
          title="Pricing & Fee Structure"
          note="to be filled by admin"
          editable
          register={methods.register}
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

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
          <Button onClick={onCancel}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Box>
    </Form>
  );
}
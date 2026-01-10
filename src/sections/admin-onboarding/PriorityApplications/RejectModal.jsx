import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { rejectApplication } from 'src/api/onboarding';
import { toast } from "src/components/snackbar";
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from "zod";
import { Form } from 'src/components/hook-form';
import { rejectApplication } from 'src/api/onboarding';

const REJECTION_REASONS = [
  {
    key: 'incomplete_docs',
    code: 'R01',
    label: 'General Rejection — Incomplete or Invalid Documentation',
    subject: 'Application Rejected – Incomplete Merchant Information',
    body: `Dear [Merchant Name],
Thank you for submitting your application for a Merchant Identification Number (MID). After reviewing your submission, we regret to inform you that your application cannot be approved at this time due to incomplete or invalid documentation.
Please ensure that all required documents are accurate and up to date, including:
- Valid business registration certificate
- Proof of address and ownership
- Latest bank statements or financial records
You may resubmit your application once the above items have been corrected.

Kind regards,
[Your Name]
Risk & Underwriting Team
[Company Name]`
  },
  {
    key: 'risk_history',
    code: 'R02',
    label: 'Rejected – High Chargeback or Risk History',
    subject: 'MID Application Status – Declined Due to Risk Profile',
    body: `Dear [Merchant Name],
Following a thorough review of your MID application, we regret to inform you that it has been declined based on your risk and chargeback history.
Our assessment indicated higher-than-acceptable levels of chargebacks, refunds, or related disputes, which exceed our current acquiring thresholds.
Unfortunately, we’re unable to proceed with onboarding under these conditions. You may consider reapplying after a minimum of [X months] once the chargeback ratio has improved.

Sincerely,
[Your Name]
Risk & Compliance Department
[Company Name]`
  },
  {
    key: 'unsupported_model',
    code: 'R03',
    label: 'Rejected – Business Model Not Supported',
    subject: 'MID Application – Business Model Not Eligible',
    body: `Dear [Merchant Name],
Thank you for your interest in partnering with [Company Name]. After reviewing your business model and activities, we regret to inform you that your application has been declined as it falls under a restricted or unsupported category within our current acquiring framework.
Unfortunately, we’re unable to provide payment processing for businesses in this sector due to elevated regulatory and operational risks.
We appreciate your understanding and wish you continued success with your business.

Best regards,
[Your Name]
Merchant Underwriting Team
[Company Name]`
  },
  {
    key: 'match_listing',
    code: 'R04',
    label: 'Rejected – Negative Background or MATCH Listing',
    subject: 'MID Application – Declined After Compliance Review',
    body: `Dear [Merchant Name],
Following our standard due diligence and compliance checks, we regret to inform you that your MID application has been declined.
The review identified prior merchant account issues or listings that do not meet our onboarding requirements.
For regulatory and confidentiality reasons, we are unable to disclose specific details, but this decision was made in accordance with network and compliance standards.
If you believe this is in error, please contact our compliance team at [email/phone].

Sincerely,
[Your Name]
Compliance & Risk Review Team
[Company Name]`
  },
  {
    key: 'financial_stability',
    code: 'R05',
    label: 'Rejected – Financial Stability or Processing History',
    subject: 'MID Application – Declined Due to Financial Assessment',
    body: `Dear [Merchant Name],
Thank you for your application. After careful financial review, we’re unable to approve your MID request at this stage.
The assessment indicated insufficient processing history or financial stability to support the requested transaction volume and risk exposure.
You are welcome to reapply after establishing at least [X months] of stable transaction activity or submitting updated financial statements.

Kind regards,
[Your Name]
Underwriting Department
[Company Name]`
  },
  {
    key: 'website_noncompliance',
    code: 'R06',
    label: 'Rejected – Website or Operational Non-Compliance',
    subject: 'MID Application – Declined Due to Website Non-Compliance',
    body: `Dear [Merchant Name],
After reviewing your application and business website, we were unable to proceed with MID approval due to non-compliance with industry website standards.
Please ensure the following are clearly visible on your site before reapplying:
- Valid SSL certificate
- Privacy Policy and Terms & Conditions
- Clear contact information and refund policy
- Accurate product/service descriptions
You may reapply once these items are updated.

Regards,
[Your Name]
Risk & Underwriting Team
[Company Name]`
  },
  {
    key: 'regulatory_restrictions',
    code: 'R07',
    label: 'Rejected – Regulatory Restrictions',
    subject: 'MID Application Declined – Regulatory Restrictions',
    body: `Dear [Merchant Name],
We appreciate your interest in working with [Company Name]. After a compliance and risk evaluation, we regret to inform you that your application has been declined due to regulatory restrictions applicable to your business category or processing region.
Our acquiring partners currently do not support this type of activity under existing network or jurisdictional regulations.
We appreciate your understanding and wish you the best in your business endeavors.

Sincerely,
[Your Name]
Compliance Department
[Company Name]`
  },
  {
    key: 'custom',
    code: 'R99', // Using R99 for a catch-all custom code
    label: 'Custom Reason (Write your own)',
    subject: 'MID Application Status Update',
    body: 'Dear [Merchant Name],\n\nFollowing a final review of your application, we regret to inform you that it has been declined. This decision was made based on [Reason].\n\nSincerely,\n[Your Name]\n[Company Name]',
  },
];

const ApplicationSchema = zod.object({
  reasonKey: zod.string().min(1, "Please select a rejection reason"),
  subject: zod.string().min(1, "Subject is required"),
  body: zod.string().min(10, "Please provide a detailed message"),
});

export default function RejectModal({ open, onClose, name, currentData }) {
  const queryClient = useQueryClient();
  const [selectedReason, setSelectedReason] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReasonChange = (key) => {
    setSelectedReason(key);
    const reason = REJECTION_REASONS.find(r => r.key === key);
    if (reason) {
      const replacedBody = reason.body
        .replaceAll('[Merchant Name]', name || '')
        // .replaceAll('[Company Name]', 'Quiklie') // or use your own company name
        // .replaceAll('[Your Name]', 'Quiklie Team'); // optional dynamic replacement

      setSubject(reason.subject);
      setBody(replacedBody);
      methods.setValue('reasonKey', key);
      methods.setValue('subject', reason.subject);
      methods.setValue('body', replacedBody);

    }
  };

  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(ApplicationSchema),
    defaultValues: { reasonKey: selectedReason, subject, body },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const rejectMutation = useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      toast.success("Application rejected successfully");
      queryClient.invalidateQueries(["applications"]);
      setLoading(false);
      onClose();
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message || "Failed to reject application");
    },
  });

  const onSubmit = handleSubmit(async () => {
    setLoading(true);
    const reasonLabel = REJECTION_REASONS.find(r => r.key === selectedReason)?.label || "Custom Reason";
    const reasonSubject = REJECTION_REASONS.find(r => r.key === selectedReason)?.subject || "Custom Reason";
    const reasonBody = REJECTION_REASONS.find(r => r.key === selectedReason)?.body || "Custom Reason";

    const payload = {
      userId: currentData?.id,
      reason: reasonLabel,
      subject: reasonSubject,
      body: reasonBody,
    };

    rejectMutation.mutate(payload);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Reject Application</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select a reason template or provide a custom rejection message.
          </Typography>

          <TextField
            select
            fullWidth
            label="Rejection Reason"
            value={selectedReason}
            onChange={(e) => handleReasonChange(e.target.value)}
            sx={{ mb: 3 }}
            error={!!methods.formState.errors.reasonKey}
            helperText={methods.formState.errors.reasonKey?.message}
          >
            {REJECTION_REASONS.map((r) => (
              <MenuItem key={r.key} value={r.key}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
            error={!!methods.formState.errors.subject}
            helperText={methods.formState.errors.subject?.message}
          />

          <TextField
            fullWidth
            multiline
            minRows={8}
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            error={!!methods.formState.errors.body}
            helperText={methods.formState.errors.body?.message}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" color="error" loading={loading} >
            {loading ? <CircularProgress size={18} /> : "Reject"}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

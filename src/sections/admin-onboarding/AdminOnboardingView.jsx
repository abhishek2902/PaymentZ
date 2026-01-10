import { DashboardContent } from 'src/layouts/dashboard';
import { Stack, Typography, Button, Box, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { m } from "framer-motion";
import { onboadinglist } from 'src/api/onboarding';
import { useQuery } from '@tanstack/react-query';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import useOnboardingStats from 'src/routes/hooks/useOnboardingStats';
import PriorityApplications from './PriorityApplications/PriorityApplications';
import OnboardingDashboard from './ApplicationQueue/OnboardingDashboard';
import AdminStats from './AdminStats/AdminStats';

export function AdminOnboardingView() {

  const { data: stats, isLoading: statsLoading } = useOnboardingStats();

  const statsData = [
    {
      icon: "mdi:file-document-outline",
      iconColor: "#3b82f6",
      chipLabel: "New",
      chipColor: "#dbeafe",
      value: stats?.newApps ?? '—',
      title: "New Applications",
      subtitle: "+5 since yesterday",
      subtitleIcon: "mdi:clock-outline",
      statusKey: "NEW"
    },
    {
      icon: "mdi:magnify",
      iconColor: "#a855f7",
      chipLabel: "Progress",
      chipColor: "#f3e8ff",
      value: stats?.kycInProgress ?? '—',
      title: "In Verification",
      subtitle: "KYC in progress",
      subtitleIcon: "mdi:account-check-outline",
      statusKey: "KYC_PENDING"
    },
    {
      icon: "mdi:timer-sand",
      iconColor: "#f97316",
      chipLabel: "Priority",
      chipColor: "#ffedd5",
      value: stats?.approvalPending ?? '—',
      title: "Approval Pending",
      subtitle: "urgent reviews",
      subtitleIcon: "mdi:alert-outline",
      statusKey: "APPROVAL_PENDING"
    },
    // {
    //   icon: "mdi:check-circle",
    //   iconColor: "#22c55e",
    //   chipLabel: "Success",
    //   chipColor: "#dcfce7",
    //   value: stats?.approvedToday ?? '—',
    //   title: "Approved Today",
    //   subtitle: "+18% vs yesterday",
    //   subtitleIcon: "mdi:trending-up",
    //   statusKey: "ACTIVE"
    // },
    {
      icon: "mdi:close-circle",
      iconColor: "#ef4444",
      chipLabel: "Declined",
      chipColor: "#fee2e2",
      value: stats?.rejected ?? '—',
      title: "Rejected",
      subtitle: "Compliance issues",
      subtitleIcon: "mdi:alert-circle-outline",
      statusKey: "REJECTED"
    },
  ];

  const frontendUrl = `${window.location.origin}`;
  const [copied, setCopied] = useState(false);
  const super_admin_id = sessionStorage.getItem('user_id');
  const onboardingLink = `${frontendUrl}/admin/onboarding/${super_admin_id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(onboardingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // reset after 1s
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const [filters, setFilters] = useState({
    page: 0,
    size: 5,
    status: null,
    search: '',
    startDate: '',
    endDate: '',
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['onboadinglist', filters],
    queryFn: () => onboadinglist(filters),
    retry: 1, // optional: retry once on failure
  });

  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleStatusClick = (statusKey) => {
    setFilters((prev) => ({
      ...prev,
      status: statusKey,
      page: 0, // reset page
    }));
  };

  const clearStatus = () => {
    setFilters((prev) => ({
      ...prev,
      status: null,
      page: 0,
    }));
  };

  return (
    <>
      <DashboardContent>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <CustomBreadcrumbs
          heading="Admins"
          links={[{ name: 'Dashboard' }, { name: 'Admin Onboarding' }]}
          sx={{ m: 0 }}
        />

        <Button
          variant="outlined"
          color={copied ? 'success' : 'primary'}
          startIcon={
            <Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} width={20} />
          }
          onClick={handleCopy}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {copied ? 'Copied Onboarding Link' : 'Copy Onboarding Link'}
        </Button>
      </Stack>

        <AdminStats
          stats={statsData}
          loading={statsLoading}
          onCardClick={
            (stat) => {
              setSelectedStatus(stat.statusKey)
              handleStatusClick(stat.statusKey)
            }
          }
          selectedStatus={selectedStatus}
        />
				
				{/* <Box sx={{mt:4}}>
					<ApplicationPipeline
						title="Application Workflow Pipeline"
						subtitle="Track the progress of merchant applications through approval stages"
						steps={[
							{ number: 1, label: "Application Received", subtitle: "Initial submission", color: "#3b82f6" },
							{ number: 2, label: "Document Review", subtitle: "KYC verification", color: "#f59e0b" },
							{ number: 3, label: "Risk Assessment", subtitle: "Compliance check", color: "#a855f7" },
							{ number: 4, label: "Final Approval", subtitle: "Account activation", color: "#22c55e" },
						]}
						cards={[
							{ value: "23", label: "New Applications", color: "#3b82f6", bg: "#eff6ff" },
							{ value: "12", label: "In Document Review", color: "#f59e0b", bg: "#fef3c7" },
							{ value: "8", label: "Risk Assessment", color: "#a855f7", bg: "#f3e8ff" },
							{ value: "47", label: "Approved & Active", color: "#22c55e", bg: "#dcfce7" },
						]}
					/>
				</Box> */}

        <Box sx={{ mt: 4 }}>
          {selectedStatus && (
            <Box 
              component={m.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              sx={{ position: 'relative' }}
            >
              {/* Close button */}
              <IconButton
                onClick={() => setSelectedStatus(null)}
                sx={{ 
                  position: "absolute",
                  top: 10,
                  right: 5,
                  bgcolor: "#fff",
                  zIndex: 10,
                  "&:hover": { bgcolor: "#f1f1f1" }
                }}
              >
                <Icon icon="mdi:close" />
              </IconButton>

              <PriorityApplications
                data={data}
                isLoading={isLoading}
                isError={isError}
                filters={filters}
                setFilters={setFilters}
              />
            </Box>
          )}
        </Box>

				<Box sx={{mt:4}}>
					<OnboardingDashboard 
            data={data} 
            isLoading={isLoading} 
            isError={isError}
            filters={filters}
            setFilters={setFilters}
          />
				</Box>

      </DashboardContent>
    </>
  );
}
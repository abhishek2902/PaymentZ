import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { paths } from 'src/routes/paths';
import { useMutation } from '@tanstack/react-query';
import { updateConnector } from 'src/api/connector';
import { useLocation, useNavigate } from 'react-router';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConnectorApiDocumentation } from './ConnectorApiDocumentation';
import { ConnectorProcessingLimits } from './ConnectorProcessingLimits';
import { AssignedAdmins } from './AssignedAdmins';
import { StatusControl } from './StatusControl';
import FailoverSettings from './FailoverSettings';
import RecentActivity from './RecentActivity';
import EditActions from './EditActions';
import { InfoCard } from './InfoCard';
import { Currencies } from './Currencies';
import ConnectorEditView from './ConnectorEditView';
import { ConnectorStatistics } from './Statistics';

export function Edit() {

  const { state } = useLocation();
  const row = state?.connectorRow || {};

  const navigate = useNavigate();

  // ---------------------------------------
  // INITIAL STATES
  // ---------------------------------------

  const [connectorData, setConnectorData] = useState({
    connectorName: row?.name || "",
    connectorType: row?.type || "",
    connectorDescription: row?.description || "",
    email: row?.email || "",
    currency: row?.currency || "",
    websiteUrl: row?.websiteUrl || "",
    webhookUrl: row?.webhookUrl || "",
  });

  const groupCredentials = (credArray) => {
    if (!Array.isArray(credArray)) return {};

    return credArray.reduce((acc, c) => {
      const env = c.environment === "SANDBOX" ? "Staging" : "Live";

      if (!acc[env]) acc[env] = [];

      acc[env].push({
        key: c.key,
        value: c.value || "",
        environmentType: c.environment,
        required: true,
        editable: true,
      });

      return acc;
    }, {});
  };

  const [credentials, setCredentials] = useState(
    groupCredentials(row?.credentials)
  );

  const [status, setStatus] = useState(row?.commonStatus);
  // const [priority, setPriority] = useState(row?.priorityLevel);

  const [limits, setLimits] = useState( {
    minAmount: row?.minTxAmt,
    maxAmount: row?.maxTxAmt,
    dailyLimit: row?.dailyLimit,
    monthlyLimit: row?.monthlyLimit,
    txPerMinute: row?.txPerMin,
    settlementPeriod: row?.settlementPeriod
  });

  const [paymentMethods, setPaymentMethods] = useState( {
    creditCards: row?.creditCard,
    debitCards: row?.debitCard,
    cryptocurrency: row?.crypto,
  });

  const [apiDocData, setApiDocData] = useState( {
    officialDocUrl: row?.docUrl,
    sdkDocUrl: row?.sdkDocUrl,
    postmanCollection: row?.postmanUrl,
    statusPage: row?.statusPageUrl,
    integrationNotes: row?.integrationGuide,
    errorGuide: row?.errorGuide
  });

  const [primaryCurrency, setPrimaryCurrency] = useState(row?.primaryCurrency || 'USD');

  const ALL_CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK"];

  const [additionalCurrencies, setAdditionalCurrencies] = useState(
    (row?.supportedCurrency && row.supportedCurrency.length > 0)
      ? ALL_CURRENCIES.reduce((acc, curr) => {
          // Set the currency to true if it's found in the supportedCurrency array, false otherwise
          acc[curr] = row.supportedCurrency.includes(curr);
          return acc;
        }, {})
      : { USD: true, EUR: false, GBP: false, CAD: false, AUD: false, JPY: false, CHF: false, SEK: false }
  );

  const [admins, setAdmins] = useState(row?.adminNames ?? []);

  const [failoverSettings, setFailoverSettings] = useState({
    primary: row?.failoverPrimary ?? "Wells Fargo",
    secondary: row?.failoverSecondary ?? "Bank of America",
    threshold: row?.failoverThreshold ?? "60% failure rate"
  });

  // const [stats] = useState(row?.stats ?? {});
  const [stats] = useState({
    totalTransactions: '1,247,890',
    successRate: '98.5%',
    volumeProcessed: '$47.2M',
    avgResponseTime: '0.8s',
    assignedAdmins: admins.length
  });

  const [activities] = useState(row?.activities ?? []);

  // ---------------------------------------
  // HANDLERS
  // ---------------------------------------

  const handleConnectorChange = (field, value) => {
    setConnectorData(prev => ({ ...prev, [field]: value }));
  };
  const handleCredentialChange = (env, key, value) => {
    setCredentials(prev => ({
      ...prev,
      [env]: (Array.isArray(prev[env]) ? prev[env] : []).map(item =>
        item.key === key ? { ...item, value } : item
      )
    }));
  };

  const handleLimitChange = (field, value) => {
    setLimits(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodChange = (method, checked) => {
    setPaymentMethods(prev => ({ ...prev, [method]: checked }));
  };

  const handleApiDocChange = (field, value) => {
    setApiDocData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrimaryCurrencyChange = (value) => {
    setPrimaryCurrency(value);
  };

  const handleAdditionalCurrencyToggle = (currency) => {
    setAdditionalCurrencies(prev => ({
      ...prev,
      [currency]: !prev[currency]
    }));
  };

  const handleRemoveAdmin = (index) => {
    setAdmins(prev => prev.filter((_, i) => i !== index));
  };

  // const assignmentId = row?.assignmentId;

  // ---------------------------------------
  // UPDATE Connector API (MUTATION)
  // ---------------------------------------

  const updateConnectorMutation = useMutation({
    mutationFn: ({ payload }) =>
      updateConnector(payload),

    onSuccess: () => {
      toast.success("Connector updated successfully");
      navigate(paths.dashboard.connector);
    },

    onError: () => {
      toast.error("Update failed");
    }
  });

  // ---------------------------------------
  // SAVE CHANGES
  // ---------------------------------------

  const handleSaveChanges = () => {

    const connectorId = row?.id;  // <-- ensure row has this

    if (!connectorId) {
      toast.error("Missing assignmentId or connectorId");
      return;
    }

    const formattedCredentials = Object.entries(credentials).flatMap(
      ([env, fields]) =>
        (Array.isArray(fields) ? fields : []).map(field => ({
          key: field.key,
          value: field.value,
          environmentType: env === "Staging" ? "SANDBOX" : "LIVE",
        }))
    );

    const payload = {
      // Basic connector info
      id:connectorId,
      connectorName: connectorData.connectorName,
      description: connectorData.connectorDescription,
      connectorType: connectorData.type,
      supportEmail: connectorData.email,
      supportedCurrency: connectorData.currency,
      websiteUrl: connectorData.websiteUrl,
      // webhookUrl: connectorData.webhookUrl,

      // Credentials
      // credentials: formattedCredentials,

      // Status & priority
      // commonStatus: status.toUpperCase(),
      // docUrl: apiDocData.officialDocUrl,
      // sdkDocUrl: apiDocData.sdkDocUrl,
      // postmanUrl: apiDocData.postmanCollection,
      // statusPageUrl: apiDocData.statusPage,
      // integrationGuide: apiDocData.integrationNotes,
      // errorGuide: apiDocData.errorGuide,
      // minTxAmt: limits.minAmount,
      // maxTxAmt: limits.maxAmount,
      // dailyLimit: limits.dailyLimit,
      // monthlyLimit: limits.monthlyLimit,
      // txPerMin: limits.txPerMinute,
      // settlementPeriod: limits.settlementPeriod,
      // creditCard: paymentMethods.creditCards,
      // debitCard: paymentMethods.debitCards,
      // crypto: paymentMethods.cryptocurrency,
      // supportedCurrency: Object.keys(additionalCurrencies).filter(currencyCode => additionalCurrencies[currencyCode]),
      // primaryCurrency,
      // priorityLevel: priority,
    };

    updateConnectorMutation.mutate({ payload });
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Connector Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Connector', href: paths.dashboard.connectors },
          { name: 'Edit', href: paths.dashboard.connectoredit }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InfoCard
        name={`${connectorData.connectorName}`}
        description={row?.description ?? 'N/A'}
        status={row?.commonStatus ?? 'N/A'}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box mt={3}>
            <ConnectorEditView
              connector={row}
              onAccountChange={handleConnectorChange}
              onCredentialChange={handleCredentialChange}
            />
          </Box>

          <Box mt={3}>
            <ConnectorApiDocumentation
              apiDocData={apiDocData}
              onApiDocChange={handleApiDocChange}
            />
          </Box>

          <Box mt={3}>
            <ConnectorProcessingLimits
              limits={limits}
              paymentMethods={paymentMethods}
              onLimitChange={handleLimitChange}
              onPaymentMethodChange={handlePaymentMethodChange}
            />
          </Box>

          <Box mt={3}>
            <Currencies
              primaryCurrency={primaryCurrency}
              setPrimaryCurrency={setPrimaryCurrency}
              additionalCurrencies={additionalCurrencies}
              setAdditionalCurrencies={setAdditionalCurrencies}
              onPrimaryCurrencyChange={handlePrimaryCurrencyChange}
              onAdditionalCurrencyToggle={handleAdditionalCurrencyToggle}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: '24px'}}>
            <Box mt={3}>
              {/* To Work */}
              <ConnectorStatistics stats={stats}/>
            </Box>

            <Box mt={3}>
              <StatusControl
                status={status}
                // priority={priority}
                onStatusChange={(e) => setStatus(e.target.value)}
                // onPriorityChange={(e) => setPriority(e.target.value)}
              />
            </Box>

            <Box mt={3}>
              <AssignedAdmins
                admins={admins}
                onRemove={handleRemoveAdmin}
              />
            </Box>

            <Box mt={3}>
              {/* {To work} */}
              <FailoverSettings
                settings={failoverSettings}
                onSettingsChange={setFailoverSettings}
              />
            </Box>

            <Box mt={3}>
              {/* To work */}
              <RecentActivity activities={activities} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <EditActions
        onSaveChanges={handleSaveChanges}
        onCancel={() => navigate(paths.dashboard.connector)}
      />
    </DashboardContent>
  );
}

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Iconify } from "src/components/iconify";

export default function ConnectorEditView({ connector, onConnectorChange, onCredentialChange }) {

  const [connectorData, setConnectorData] = useState({
    connectorName: connector?.name || "",
    connectorDescription: connector?.description || "",
    connectorType: connector?.type || "",
    connectorEmail: connector?.email || "",
    connectorCurrency: connector?.currency || "",
    websiteUrl: connector?.websiteUrl || "",
    webhookUrl: connector?.webhookUrl || "",
  });

  const [credentials, setCredentials] = useState({});

  // -----------------------------------
  // Group credentials into Staging / Live
  // -----------------------------------
  useEffect(() => {
    if (!connector?.credentials) {
      setCredentials({});
      return;
    }

    const grouped = connector.credentials.reduce((acc, c) => {
      const env = c.environment === "SANDBOX" ? "Staging" : "Live";

      if (!acc[env]) acc[env] = [];

      acc[env].push({
        key: c.key,
        value: c.value || "",
        required: true,
        editable: true,
      });

      return acc;
    }, {});

    setCredentials(grouped);
  }, [connector]);

  // -----------------------------------
  // Handle connector input
  // -----------------------------------
  const handleConnectorChangeLocal = (e) => {
    const { name, value } = e.target;

    setConnectorData((prev) => ({ ...prev, [name]: value }));

    // Notify parent Edit page
    onConnectorChange?.(name, value);
  };

  // -----------------------------------
  // Handle credential updates
  // -----------------------------------
  const handleCredentialChangeLocal = (env, key, value) => {
    setCredentials((prev) => ({
      ...prev,
      [env]: prev[env].map((item) =>
        item.key === key ? { ...item, value } : item
      ),
    }));

    // Notify parent Edit page
    onCredentialChange?.(env, key, value);
  };

  return (
    <Box pt={0}>
      <Card sx={{ p: 3 }}>
        {/* Section Title */}
        <Box display="flex" alignItems="center" mb={4}>
          <Iconify icon="mdi:information" width={24} height={24} color="success.main" />
          <Typography variant="subtitle1" ml={1}>
            Basic Information
          </Typography>
        </Box>

        <Grid container spacing={2}>

          {/* Connector Name (disabled) */}
          {/* <Grid item xs={12} md={6}>
            <TextField
              label="Connector"
              value={connector?.connectorName || ""}
              disabled
              fullWidth
            />
          </Grid> */}

          {/* Connector Name */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Connector Name"
              required
              name="connectorName"
              value={connectorData.connectorName}
              onChange={handleConnectorChangeLocal}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Connector Type"
              name="connectorType"
              value={connectorData.connectorType}
              onChange={handleConnectorChangeLocal}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Connector Email"
              name="connectorEmail"
              value={connectorData.connectorEmail}
              onChange={handleConnectorChangeLocal}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Connector Currency"
              name="connectorCurrency"
              value={connectorData.connectorCurrency}
              onChange={handleConnectorChangeLocal}
              fullWidth
            />
          </Grid>

          {/* Website URL */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Approved Website URL"
              required
              name="websiteUrl"
              value={connectorData.websiteUrl}
              onChange={handleConnectorChangeLocal}
              fullWidth
            />
          </Grid>

          {/* Webhook URL */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Approved Webhook URL"
              name="webhookUrl"
              value={connectorData.webhookUrl}
              onChange={handleConnectorChangeLocal}
              fullWidth
            />
          </Grid>
        </Grid>

          {/* Description */}
          <Grid item xs={12} mt={3}>
            <TextField
              label="Connector Description"
              name="connectorDescription"
              value={connectorData.connectorDescription}
              onChange={handleConnectorChangeLocal}
              multiline
              rows={2}
              fullWidth
            />
          </Grid>
        {/* Credentials Section
        {credentials && Object.keys(credentials).length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              <Icon icon="mdi:key-outline" style={{ marginRight: 6 }} />
              Credentials
            </Typography>

            {Object.entries(credentials).map(([env, fields]) => (
              <Box key={env} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {env} Credentials
                </Typography>

                <Grid container spacing={2}>
                  {fields.map((item, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                      <TextField
                        fullWidth
                        required={item.required}
                        label={item.key}
                        value={item.value || ""}
                        onChange={(e) =>
                          handleCredentialChangeLocal(env, item.key, e.target.value)
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </>
        )} */}

      </Card>
    </Box>
  );
}

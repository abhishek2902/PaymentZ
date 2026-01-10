  import { Card, CardContent, Box, Typography, Chip } from "@mui/material";
  import { Icon } from "@iconify/react";
  import { m } from "framer-motion";

  export default function StatCard({ 
    icon, 
    iconColor, 
    chipLabel, 
    chipColor, 
    value, 
    title, 
    subtitle, 
    subtitleIcon,
    onClick,
    isActive,
    ...props
  }) {
    return (
      <Card
        component={m.div}
        animate={isActive ? { y: -8, scale: 1.04 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onClick={onClick}
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          boxShadow: isActive ? 6 : 1,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent= "space-between" gap={2}>
            {/* Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: iconColor,
                color: "#fff",
                fontSize: 22,
              }}
            >
              <Icon icon={icon} />
            </Box>

            {/* Chip (status) */}
            <Chip 
              label={chipLabel} 
              size="small" 
              sx={{ bgcolor: chipColor, color: iconColor, fontWeight: 500 }}
            />
          </Box>

          {/* Value */}
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
            {value}
          </Typography>

          {/* Title */}
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Box display="flex" alignItems="center" gap={0.5} mt={1}>
              {subtitleIcon && <Icon icon={subtitleIcon} fontSize={16} />}
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

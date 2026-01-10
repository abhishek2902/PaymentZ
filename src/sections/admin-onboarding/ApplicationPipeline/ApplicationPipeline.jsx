import { Box, Typography, Grid } from "@mui/material";
import PipelineStep from "./PipelineStep";
import PipelineCard from "./PipelineCard";

export default function ApplicationPipeline({ title, subtitle, steps, cards }) {
  return (
    <Box p={3} borderRadius={2} boxShadow={1} bgcolor="#fff">
      {/* Title */}
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          {subtitle}
        </Typography>
      )}

      {/* Steps */}
      {/* <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap"> */}
      <Grid container spacing={2}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
          <PipelineStep
            key={index}
            number={step.number}
            label={step.label}
            subtitle={step.subtitle}
            color={step.color}
            isLast={index === steps.length - 1}
          />
        </Grid>
        ))}
      </Grid>

      {/* Cards */}
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <PipelineCard
              value={card.value}
              label={card.label}
              color={card.color}
              bg={card.bg}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

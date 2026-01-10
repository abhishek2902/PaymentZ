import { Grid } from "@mui/material";
import StatCard from "./StatCard";

export default function AdminStats({ stats, loading, onCardClick, selectedStatus }) {

  const skeletonArray = [1, 2, 3, 4, 5];

  return (
    <Grid container spacing={2}>
      {(loading ? skeletonArray : stats).map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          {!loading && (
            <StatCard
              {...stat}
              isActive={selectedStatus === stat.statusKey}
              onClick={() => onCardClick(stat)}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
}


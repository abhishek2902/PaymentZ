import { useQuery } from "@tanstack/react-query";
import { Grid } from "@mui/material";
import { analyticPie } from "src/api/dashboard";
import { AppCurrentDownload } from "../app-current-download";

export function TransactionAnalytic() {

  const {
    data: analyticPieResponse,
    isLoading: isAnalyticPieLoading,
    isError: isAnalyticPieError,
  } = useQuery({
    queryKey: ['analyticPieResponse'],
    queryFn: analyticPie,
    keepPreviousData: true,
  });

  const pieData = analyticPieResponse?.data || {};

  return (
      <AppCurrentDownload
        title="Transaction Analysis"
        subheader="Based on overall order volume"
        chart={{
          series: [
            { label: 'Success', value: pieData.success ?? 0 },
            { label: 'Declined', value: pieData.declined ?? 0 },
            { label: 'Refunded', value: pieData.refunded ?? 0 },
            { label: 'Chargeback', value: pieData.chargeback ?? 0 },
          ],
        }}
        loading={isAnalyticPieLoading}
      />
  );
}

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticMonthly } from "src/api/dashboard";
import { Grid } from "@mui/material";
import { AppAreaInstalled } from "../app-area-installed";

export function BusinessInsights() {

	const [selectedSeries, setSelectedSeries] = useState(String(new Date().getFullYear()));

	const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);
	
	const {
		data: analyticMonthlyResponse,
		isLoading: isAnalyticMonthlyLoading,
		isError: isAnalyticMonthlyError,
		refetch: refetchAnalyticMonthly,
	} = useQuery({
		queryKey: ['analyticMonthlyResponse', selectedSeries],
		queryFn: () =>
			analyticMonthly({year:selectedSeries}),
		keepPreviousData: true,
	});

  const normalizeMonthlyData = (apiData = []) => {
    const base = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      success: 0,
      declined: 0,
      refunded: 0,
      chargeback: 0,
    }));

    apiData.forEach((item) => {
      const index = item.month - 1;
      if (index >= 0 && index < 12) {
        base[index] = { ...base[index], ...item };
      }
    });

    return base;
  };

  const monthlyData = normalizeMonthlyData(
    analyticMonthlyResponse?.data
  );

  return (
      <AppAreaInstalled
        title="Business Insights"
        subheader="Monthly transaction overview"
				selectedSeries={selectedSeries}
				handleChangeSeries={handleChangeSeries}
        chart={{
          categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
					series: [
						{
							name: '2022',
							data: [
								{ name: 'Success', data: [1, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
								{ name: 'Declined', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
								{ name: 'Refunded', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
								{ name: 'Chargeback', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
							],
						},
						{
							name: '2023',
							data: [
								{ name: 'Success', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
								{ name: 'Declined', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
								{ name: 'Refunded', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
								{ name: 'Chargeback', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
							],
						},
						{
							name: '2024',
							data: [
								{	name: 'Success', data: monthlyData.map((m) => m.success) },
								{ name: 'Declined', data: monthlyData.map((m) => m.declined)},
								{ name: 'Refunded', data: monthlyData.map((m) => m.refunded)},
								{ name: 'Chargeback',data: monthlyData.map((m) => m.chargeback)},
							],
						},
						{
							name: '2025',
							data: [
								{	name: 'Success', data: monthlyData.map((m) => m.success) },
								{ name: 'Declined', data: monthlyData.map((m) => m.declined)},
								{ name: 'Refunded', data: monthlyData.map((m) => m.refunded)},
								{ name: 'Chargeback',data: monthlyData.map((m) => m.chargeback)},
							],
						},
						{
							name: '2026',
							data: [
								{	name: 'Success', data: monthlyData.map((m) => m.success) },
								{ name: 'Declined', data: monthlyData.map((m) => m.declined)},
								{ name: 'Refunded', data: monthlyData.map((m) => m.refunded)},
								{ name: 'Chargeback',data: monthlyData.map((m) => m.chargeback)},
							],
						},
					],
        }}
      />
  );
}

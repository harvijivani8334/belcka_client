"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
// components
import WelcomeCard from "@/app/components/dashboard/TheWelcomeCard";
import Earnings from "@/app/components/dashboard/TheEarnings";
import MonthlySales from "@/app/components/dashboard/TheMonthlySales";
import SalesOverview from "@/app/components/dashboard/TheSalesOverview";

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* ------------------------- row 1 ------------------------- */}
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <Grid container spacing={3}>
              <Grid size={12}>
                <WelcomeCard />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  lg: 6,
                  sm: 6,
                }}
              >
                <Earnings />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  lg: 6,
                  sm: 6,
                }}
              >
                <MonthlySales />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6,
            }}
          >
            <SalesOverview />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

import { uniqueId } from "lodash";

import { IconChartPie } from "@tabler/icons-react";
import { NavGroup } from "@/app/(DashboardLayout)/types/layout/sidebar";

const Menuitems: NavGroup[] = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconChartPie,
    href: "/",
  },
];

export default Menuitems;

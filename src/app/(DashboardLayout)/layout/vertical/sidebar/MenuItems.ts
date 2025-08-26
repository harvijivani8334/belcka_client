import { uniqueId } from "lodash";

import { IconChartPie } from "@tabler/icons-react";
import { NavGroup } from "@/app/(DashboardLayout)/types/layout/sidebar";
import { IconFiles } from "@tabler/icons-react";

const Menuitems: NavGroup[] = [
  // {
  //   id: uniqueId(),
  //   title: "Dashboard",
  //   icon: IconChartPie,
  //   href: "/",
  // },
   {
    id: uniqueId(),
    title: "Projects",
    icon: IconFiles,
    href: "/apps/projects/list",
  },
];

export default Menuitems;

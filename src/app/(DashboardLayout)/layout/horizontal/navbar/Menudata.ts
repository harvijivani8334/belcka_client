import { IconFiles, IconHome } from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/dashboards/",
    children: [
      {
        id: uniqueId(),
        title: "Projects",
        icon: IconFiles,
        href: "/apps/projects/list",
      },
    ],
  },
];
export default Menuitems;

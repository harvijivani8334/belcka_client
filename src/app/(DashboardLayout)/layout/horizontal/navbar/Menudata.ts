import { IconFiles, IconHome } from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/",
    children: [
      {
        id: uniqueId(),
        title: "Projects",
        icon: IconFiles,
        href: "/apps/projects/index",
      },
    ],
  },
];
export default Menuitems;

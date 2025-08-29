import React from "react";
import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
} from "@mui/material";
import Profile from "./Profile";
import Search from "./Search";
import Company from "./Company";
import { useContext } from "react";
import config from "@/app/context/config";
import {
  IconCategory2,
  IconMenu2,
  IconMoon,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import { CustomizerContext } from "@/app/context/customizerContext";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Navigation from "./Navigation";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const {
    activeMode,
    setActiveMode,
    setIsCollapse,
    isCollapse,
    isMobileSidebar,
    setIsMobileSidebar,
  } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.default,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.primary,
    paddingLeft: "16px !important",
    paddingRight: "16px !important",
  }));

  const CollpaseMenubar = styled(Box)(({ theme }) => ({
    position: "absolute",
    left: "4px",
    top: "4px",
    right: "4px",
    padding: "7px 15px",
    background: theme.palette.background.paper,
    border: `1px solid ${borderColor}`,
    zIndex: 1,
    borderRadius: "7px",
  }));

  const [isVisible, setIsVisible] = useState(false);

  const session = useSession();

  const user = session.data?.user as User & { company_id?: string | null } & {
    company_name?: string | null;
  } & {
    company_image?: number | null;
  } & { id: number };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <Box flexGrow={1} />
        <Stack direction="row" gap={1} alignItems="center">
          <Company />

          <IconButton color="inherit">
            {activeMode === "light" ? (
              <IconMoon size="21" onClick={() => setActiveMode("dark")} />
            ) : (
              <IconSun size="21" onClick={() => setActiveMode("light")} />
            )}
          </IconButton>

          {lgDown ? (
            <IconButton
              color="inherit"
              onClick={() => setIsVisible(!isVisible)}
            >
              <IconCategory2 size="21" />
            </IconButton>
          ) : null}

          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}

          {/* ------------------------------------------- */}

          <Box
            mx={1}
            sx={{
              width: "1px",
              backgroundColor: "rgba(0,0,0,0.1)",
              height: "25px",
            }}
          />

          <Profile />

          {isVisible && (
            <CollpaseMenubar>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Box display="flex" gap={1}>
                  <Company />
                  <Search />
                </Box>
                <IconButton
                  color="inherit"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <IconX size="21" />
                </IconButton>
              </Stack>
            </CollpaseMenubar>
          )}
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;

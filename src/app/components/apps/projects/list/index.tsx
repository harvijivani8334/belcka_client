"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  IconButton,
  Stack,
  Drawer,
  CircularProgress,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { IconArrowLeft } from "@tabler/icons-react";
import AddressesList from "./addresses-list";
import api from "@/utils/axios";
import Cookies from "js-cookie";
import "react-day-picker/dist/style.css";
import "../../../../global.css";

dayjs.extend(customParseFormat);

export type ProjectList = {
  id: number;
  company_id: number;
  project_id: number;
  name: string;
  currency: string | null;
  address: string;
  budget: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  progress: string;
  status_int: number;
  status_text: string;
  check_ins: number;
  image_count: number;
};

export interface TradeList {
  id: number;
  name: string;
}

const TablePagination = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProjectList[]>([]);
  const [address, setAddress] = useState<ProjectList[]>([]);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const session = useSession();
  const user = session.data?.user as User & { company_id?: number | null };

  const status = ["Completed", "To Do", "In Progress"];
  const COOKIE_PREFIX = "project_";
  const projectID = Cookies.get(COOKIE_PREFIX + user?.id);
  const [formData, setFormData] = useState<any>({
    project_id: Number(projectID),
    company_id: user?.company_id,
    name: "",
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get(`company-clients/projects`);
      if (res.data?.info) {
        setData(res.data.info);

        const cookieProjectId = Cookies.get(COOKIE_PREFIX + user?.id);
        const validProjectId = res.data.info.some(
          (p: any) => p.id === Number(cookieProjectId)
        )
          ? Number(cookieProjectId)
          : res.data.info[0]?.id;

        setProjectId(validProjectId);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [user?.company_id, user?.id, projectId, projectID]);

  useEffect(() => {
    if (projectId && user?.id) {
      Cookies.set(COOKIE_PREFIX + user?.id, projectId.toString(), {
        expires: 30,
      });
    }
  }, [projectId, user?.id]);

  // Fetch addresses for selected project
  const fetchHistories = async () => {
    try {
      const res = await api.get(`project/get-history?project_id=${projectId}`);
      if (res.data?.info) {
        setHistory(res.data.info);
      }
    } catch (err) {
      console.error("Failed to fetch address", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      setFormData((prev: any) => ({
        ...prev,
        project_id: projectId,
      }));
    }
  }, [projectId]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get(`address/get?project_id=${projectId}`);
      if (res.data) {
        setAddress(res.data.info);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
    }
  };
  useEffect(() => {
    if (projectId) {
      fetchAddresses();
      fetchHistories();
    }
  }, [projectId]);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll active tab into view whenever value changes
  useEffect(() => {
    if (tabRefs.current[value]) {
      tabRefs.current[value]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [value]);

  const formatDate = (date: string | undefined) => {
    return dayjs(date ?? "").isValid() ? dayjs(date).format("DD/MM/YYYY") : "-";
  };

  // if (loading == true) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       minHeight="300px"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  return (
    <Box>
      <Stack
        mt={3}
        mr={2}
        ml={2}
        mb={2}
        justifyContent="space-between"
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Grid
          display="flex"
          width="100%"
          gap={1}
          alignItems="center"
          justifyContent="flex-start"
          flexWrap="wrap"
          className="project_wrapper"
        >
          <Box display="flex" alignItems="center">
            <Autocomplete
              fullWidth
              id="project_id"
              options={data}
              value={
                data.find((project: any) => project.id === projectId) ?? null
              }
              onChange={(event, newValue: any) => {
                setProjectId(newValue.id);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  placeholder="Projects"
                  className="project-selection"
                  onKeyDown={(e: any) => e.preventDefault()}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: true,
                    style: { caretColor: "transparent" },
                  }}
                />
              )}
            />
          </Box>
          <Button
            color="primary"
            sx={{ width: "9%" }}
            variant="outlined"
            onClick={() => setDialogOpen(true)}
          >
            Activity
          </Button>
        </Grid>
      </Stack>
      <Divider />

      <AddressesList projectId={projectId} searchTerm={searchTerm} />
      <Drawer
        anchor="right"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            width: 350,
            maxWidth: "100%",
          },
        }}
      >
        <Box sx={{ position: "relative", p: 2 }}>
          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={() => setDialogOpen(false)}
            size="small"
            sx={{
              position: "absolute",
              right: 0,
              top: 8,
              color: (theme) => theme.palette.grey[900],
              backgroundColor: "transparent",
              zIndex: 10,
              width: 50,
              height: 50,
            }}
          >
            <IconX size={18} />
          </IconButton>
          {/* Project List */}
          <Grid container spacing={2} display="block">
            <Box
              display={"flex"}
              alignContent={"center"}
              alignItems={"center"}
              flexWrap={"wrap"}
            >
              <IconButton onClick={() => setDialogOpen(false)}>
                <IconArrowLeft />
              </IconButton>
              <Typography variant="h5" fontWeight={700}>
                Project Activities
              </Typography>
            </Box>
            {history.length > 0 ? (
              <Box mt={3}>
                <Box
                  sx={{
                    maxHeight: history.length > 3 ? "auto" : "auto",
                    overflow: history.length > 3 ? "auto" : "visible",
                    pr: 0,
                  }}
                >
                  {history.map((addr, index) => {
                    let color = "";

                    switch (addr.status_int) {
                      case 13:
                        color = "#A600FF";
                        break;
                      case 14:
                        color = "#A600FF";
                        break;
                      case 3:
                        color = "#FF7F00";
                        break;
                      case 4:
                        color = "#32A852";
                        break;
                      default:
                        color = "#999";
                    }

                    return (
                      <Box
                        key={addr.id ?? index}
                        mb={index === address.length - 1 ? 0 : 2}
                        pl={2}
                        pr={2}
                        mt={2}
                        position="relative"
                        display="flex"
                        alignItems="center"
                        sx={{
                          width: "100%",
                          lineHeight: "10px",
                          height: "100px",
                          borderRadius: "25px",
                          boxShadow: "rgb(33 33 33 / 12%) 0px 4px 4px 0px",
                          border: "1px solid rgb(240 240 240)",
                        }}
                      >
                        <Box
                          position="absolute"
                          top="-10px"
                          left="15px"
                          bgcolor={color}
                          px={1.5}
                          borderRadius="10px"
                          zIndex={1}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            fontSize={"12px !important"}
                            color="#fff"
                          >
                            {addr.status_text}
                          </Typography>
                        </Box>
                        <Box
                          display="initial"
                          width="100%"
                          textAlign="start"
                          mt={1}
                        >
                          <Typography
                            fontSize="14px"
                            className="multi-ellipsis"
                          >
                            {addr.message}
                          </Typography>
                          <p
                            style={{
                              fontSize: "12px",
                              textAlign: "end",
                              color: "GrayText",
                            }}
                            color="textSecondary"
                          >
                            {formatDate(addr.date_added)}
                          </p>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <>
                <Typography mt={2} ml={2} variant="h5">
                  No activities are found for this project!!
                </Typography>
              </>
            )}
          </Grid>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TablePagination;

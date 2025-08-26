import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import ProjectList from "@/app/components/apps/projects/list";
import { ProjectProvider } from "@/app/context/Projectcontext";
import BlankCard from "@/app/components/shared/BlankCard";

const ProjectListing = () => {
  return (
    <ProjectProvider>
      <PageContainer title="Project List" description="this is Project List">
        <BlankCard>
          <ProjectList />
        </BlankCard>
      </PageContainer>
    </ProjectProvider>
  );
};
export default ProjectListing;

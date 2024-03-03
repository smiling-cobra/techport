import { API_URL } from "~/constants/api";
import type { ProjectsMetaData, RawProjectDetails } from "~/interfaces";

export const fetchProjectDetails = async (projectsMeta: ProjectsMetaData[] | undefined) => {
    if (!projectsMeta) {
      console.warn('No projects to fetch');
      return [];
    }
  
    try {
      const projectDetailsPromises = projectsMeta.map(({ projectId }) => $fetch(`${API_URL.PROJECTS}/${projectId}`));
      return await Promise.all(projectDetailsPromises ?? []) as Array<RawProjectDetails>;
    } catch (error) {
      console.error('Error fetching project details', error);
      throw error;
    }
  };
import type { ProjectDetails, RawProjectDetails } from "~/interfaces";

export const usePagination = (
  projectsList: Array<RawProjectDetails> | null,
  currPage: number,
  itemsPerPage: number
): Array<ProjectDetails> => {
  if (!projectsList) return [];
  
  const parsedProjects = projectsList.map(({ project }) => ({ ...project }));
  const start = (currPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return parsedProjects.slice(start, end);
};
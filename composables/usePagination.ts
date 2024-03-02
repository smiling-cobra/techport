interface Organization {
  organizationName: string;
  organizationId: number;
}

interface ProjectDetails {
  title: string;
  projectId: number;
  md: Array<Record<string, string>>;
  pms: Array<Record<string, string>>;
  coInvestigators: Array<Record<string, string>>;
  leadOrganization: Organization;
  supportingOrganizations: Array<Organization>;
  principalInvestigators: Array<Record<string, string>>;
  directors: Array<Record<string, string>>;
  executives: Array<Record<string, string>>;
  startDateString: string;
  endDateString: string;
  statusDescription: string;
  website:string;
}

interface RawProjectDetails {
  project: ProjectDetails;
}

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
export interface ProjectsMetaData {
  acronym: string;
  lastUpdated: string;
  projectId: number;
  title: string;
  website: string;
}

export interface RawProjectsMetaData {
  projects: ProjectsMetaData[];
}

export enum PageChunks {
  TEN = 10,
  FIFTY = 50,
  TWENTY_FIVE = 25,
}

export interface RawProjectDetails {
  project: ProjectDetails;
}

export interface Organization {
  organizationName: string;
  organizationId: number;
}

export interface ProjectDetails {
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
  website: string;
}

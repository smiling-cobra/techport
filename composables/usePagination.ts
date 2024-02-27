interface ProjectRestructured {
    name: string;
    startDate: string;
    endDate: string;
    releaseStatus: string;
    statusDescription: string;
    website: string;
  }

export const usePagination = (projects: ComputedRef<ProjectRestructured[]>, page = 10) => {
    return projects.value.slice();
};
interface ProjectRestructured {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    releaseStatus: string;
    statusDescription: string;
    website: string;
  }

export const usePagination = (projects: ComputedRef<ProjectRestructured[]>, currPage = 1, nextPage = 2) => {
    return projects.value.slice();
};
<template>
  <v-container fluid>
    <div v-if="projectsPending" class="pending-block">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <div v-else-if="projectsError">
      <v-alert dense outlined color="error">
        {{ projectsError }}
      </v-alert>
    </div>

    <div v-else class="d-flex flex-column main">
      <v-row justify="space-between" align="start">
        <!-- Left Side -->
        <v-col cols="12" md="3">
          <v-date-picker v-on:update:model-value="onDateChange" class="elevation-6" color="primary"
            :max="currentDate" />
        </v-col>

        <!-- Right Side -->
        <v-col cols="12" md="9">
          <v-row class="right-side-scroll">
            <v-col cols="12" md="3" v-for="item in paginatedProjects" :key="item.projectId">
              <project-card :pid="item.projectId" :name="item.title" :startDate="item.startDateString"
                :endDate="item.endDateString" :statusDescription="item.statusDescription" :website="item.website"
                :on-click="handleCardClick" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- Pagination Component -->
      <v-pagination :length="totalPages" v-model="currPaginationPage" circle />
    </div>
    <div class="text-center">
      <v-overlay v-model="isModalOpen">
        <v-card class="pa-2" width="400">
          <div>Lead Organization: {{ selectedProject?.leadOrganization.organizationName }}</div>
          <div>Supporting Organizations:</div>
          <v-col v-for="organization in selectedProject?.supportingOrganizations" :key="organization.organizationName">
            {{ organization.organizationName }}
          </v-col>
        </v-card>
      </v-overlay>
    </div>
  </v-container>
</template>

<style>
.main {
  margin-top: 72px;
  height: calc(100vh - 108px);
}

.right-side-scroll {
  max-height: 100vh;
  overflow-y: auto;
}

.small-font {
  font-size: 14px !important;
}

.pending-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 72px);
}
</style>

<script setup lang="ts">
import { QUERY_KEYS } from '~/constants/index';
import { API_URL } from '~/constants/api';
import { useLocalStorage } from '~/composables/useLocalStorage';
import { usePagination } from '~/composables/usePagination';
import { dateToYYYYMMDD, getCurrentDate, getSevenDaysOffset } from '~/utils/dateUtils';


interface ProjectsMetaData {
  acronym: string;
  lastUpdated: string;
  projectId: number;
  title: string;
  website: string;
}

interface RawProjectsMetaData {
  projects: ProjectsMetaData[];
}

enum PageChunks {
  TEN = 10,
  FIFTY = 50,
  TWENTY_FIVE = 25,
}

interface RawProjectDetails {
  project: ProjectDetails;
}

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
  website: string;
}

const [getValue, setValue] = useLocalStorage();

const handleCardClick = (id: number) => {
  const currentProject = paginatedProjects.value.find(({ projectId }) => projectId === id);

  if (!currentProject) {
    console.warn('No project found');
    return;
  }

  selectedProject.value = currentProject;
  isModalOpen.value = true;
};

const onDateChange = (value: unknown) => {
  requestedDateRange.value = dateToYYYYMMDD(value as number);
  
  // Store the selected date in local storage
  setValue('requestedDateRange', requestedDateRange.value);
};

const getDefaultRequestDate = () => {
  // If the code is running on the client side,
  // get the stored date from local storage
  // if (typeof window !== 'undefined') {
  //   const storedDate = getValue('requestedDateRange');
  //   return dateToYYYYMMDD(storedDate as unknown as number);
  // }

  return getSevenDaysOffset();
};

const currPaginationPage = ref(1);
const itemsPerPage = ref(PageChunks.TEN);

const currentDate = ref(getCurrentDate());
const requestedDateRange = ref(getDefaultRequestDate());

const isModalOpen = ref(false);
const selectedProject = ref<ProjectDetails | null>(null);

const {
  data: projectsMetaData,
  pending: projectsMetaDataPending,
  error: projectsMetaDataError,
} = await useAsyncData<RawProjectsMetaData>(
  QUERY_KEYS.PROJECTS_METADATA,
  () => $fetch(API_URL.PROJECTS,
    { query: { updatedSince: requestedDateRange.value } }
  ),
  { watch: [requestedDateRange] }
)

const fetchProjectDetails = async () => {
  if (!projectsMetaData.value?.projects) {
    console.warn('No projects to fetch');
    return [];
  }

  try {
    const projectDetailsPromises = projectsMetaData.value?.projects.map(({ projectId }) => $fetch(`${API_URL.PROJECTS}/${projectId}`));
    return await Promise.all(projectDetailsPromises ?? []) as Array<RawProjectDetails>;
  } catch (error) {
    console.error('Error fetching project details', error);
    throw error;
  }
};

const {
  data: fetchedProjects,
  pending: projectsPending,
  error: projectsError
} = await useAsyncData<Array<RawProjectDetails>>(
  QUERY_KEYS.PROJECT_DATA,
  fetchProjectDetails,
  { watch: [projectsMetaData] }
);

const paginatedProjects = computed(() =>
  usePagination(
    fetchedProjects.value,
    currPaginationPage.value,
    itemsPerPage.value
  ));

const totalPages = computed(() =>
  Math.ceil(
    (fetchedProjects?.value?.length || 0) / itemsPerPage.value
  ));

</script>

<template>
  <v-container fluid>
    <div v-if="projectsPending" class="pending-block">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
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
          <v-date-picker
            v-on:update:model-value="onDateChange" 
            class="elevation-6"
            color="primary"
            :max="currentDate" />
        </v-col>

        <!-- Right Side -->
        <v-col cols="12" md="9">
          <v-row class="right-side-scroll">
            <v-col cols="12" md="3" v-for="project in paginatedProjects" :key="project.id">
              <project-card
                :pid="project.id"
                :name="project.name"
                :startDate="project.startDate"
                :endDate="project.endDate"
                :statusDescription="project.statusDescription"
                :website="project.website"
                @handleCardClick="handleCardClick"
                />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- Pagination Component -->
      <v-pagination :length="totalPages" v-model="currPaginationPage" circle></v-pagination>
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
import { dateToYYYYMMDD, getCurrentDate, getSevenDaysOffset } from '~/utils/dateUtils';

interface ProjectsMetaData {
  acronym: string;
  lastUpdated: string;
  projectId: number;
  title: string;
  website: string;
}

enum PaginationChunks {
  TEN = 10,
  FIFTY = 50,
  TWENTY_FIVE = 25,
}

const [getValue, setValue] = useLocalStorage();

const handleCardClick = (id: number) => {
  console.log('Card clicked', id);
};

const onDateChange = (value: unknown) => {
  requestedDateRange.value = dateToYYYYMMDD(value as number);
  setValue('requestedDateRange', requestedDateRange.value);
};

const getDefaultRequestDate = () => {
  // If the code is running on the client side,
  // get the stored date from local storage
  if (typeof window !== 'undefined') {
    const storedDate = getValue('requestedDateRange');
    return dateToYYYYMMDD(storedDate as unknown as number);
  }

  return getSevenDaysOffset();
};

const currPaginationPage = ref(1);
const itemsPerPage = ref(PaginationChunks.TEN);

const currentDate = ref(getCurrentDate());
const requestedDateRange = ref(getDefaultRequestDate());

const {
  data: projectsMetaData,
  pending: projectsMetaDataPending,
  error: projectsMetaDataError,
} = await useAsyncData<{ projects: ProjectsMetaData[] }>(
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
    return await Promise.all(projectDetailsPromises ?? []);
  } catch (error) {
    console.error('Error fetching project details', error);
    throw error;
  }
};

const {
  data: fetchedProjects,
  pending: projectsPending,
  error: projectsError
} = await useAsyncData(
  QUERY_KEYS.PROJECT_DATA,
  fetchProjectDetails,
  { watch: [projectsMetaData] }
);

const projectsRestructured = computed(() => {
  if (!fetchedProjects.value) return [];

  return fetchedProjects?.value.map((item: any) => ({
    id: item.project.projectId,
    name: item.project.title,
    startDate: item.project.startDateString,
    endDate: item.project.endDateString,
    statusDescription: item.project.statusDescription,
    website: item.project.website,
  }))
});

const paginatedProjects = computed(() => {
  const start = (currPaginationPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return projectsRestructured.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(projectsRestructured.value.length / itemsPerPage.value);
});

</script>

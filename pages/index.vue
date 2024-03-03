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

    <!-- Project Details Component -->
    <v-overlay v-model="isModalOpen" class="d-flex justify-center align-center">
      <project-details-card :project="selectedProject" />
    </v-overlay>
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
import { PageChunks, type ProjectDetails, type RawProjectDetails, type RawProjectsMetaData } from '~/interfaces';
import { fetchProjectDetails } from '~/services/projectsService';

const [getValue, setValue] = useLocalStorage();

const handleCardClick = (id: number) => {
  const currProject = paginatedProjects.value.find(({ projectId }) => projectId === id);

  if (!currProject) {
    console.warn('No project found');
    return;
  }

  selectedProject.value = currProject;
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

const {
  data: fetchedProjects,
  pending: projectsPending,
  error: projectsError
} = await useAsyncData<Array<RawProjectDetails>>(
  QUERY_KEYS.PROJECT_DATA,
  () => fetchProjectDetails(
    projectsMetaData.value?.projects,
  ),
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

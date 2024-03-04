<template>
  <v-container fluid class="pt-16 pb-16">
    <div v-if="projectsPending || projectsMetaDataPending" class="pending-block">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <div v-else-if="projectsError || projectsMetaDataError">
      <v-alert dense outlined color="error">
        {{ projectsError }}
      </v-alert>
    </div>

    <v-container fluid v-else>
      <v-row justify="space-between" align="start">
        <v-col cols="12" md="3">
          <v-date-picker width="100%" v-on:update:model-value="onDateChange" class="elevation-6 mb-4" color="primary" :max="currentDate" />
          <v-combobox variant="outlined" label="Items per page" :items="pageChunksValues" v-on:update:model-value="onItemsPerPageChange" v-model:model-value="itemsPerPage" />
        </v-col>

        <v-col cols="12" md="9" class="right-side-scroll">
          <v-row>
            <v-col cols="12" md="3" v-for="item in paginatedProjects" :key="item.projectId">
              <project-card :pid="item.projectId" :name="item.title" :startDate="item.startDateString"
                :endDate="item.endDateString" :statusDescription="item.statusDescription" :website="item.website"
                :on-click="handleCardClick" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Don't show pagination if there's only 1 page -->
      <div v-if="totalPages > 1" class="pagination-container">
        <v-pagination :length="totalPages" v-model="currPaginationPage" circle />
      </div>
    </v-container>

    <!-- Project Details Component -->
    <v-overlay v-model="isModalOpen" class="d-flex justify-center align-center">
      <project-details-card :project="selectedProject" />
    </v-overlay>
  </v-container>
</template>

<style>
.pagination-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 72px;
  background-color: white;
  z-index: 1000;
  box-shadow: 0 -4px 10px -5px rgba(0, 0, 0, 0.2);
  padding-top: 8px;
}

.main {
  margin-top: 72px;
}

.right-side-scroll {
  max-height: 100vh;
  overflow-y: scroll;
  padding-bottom: 160px; 
}

.small-font {
  font-size: 14px !important;
}

.pending-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 72px);
}
</style>

<script setup lang="ts">
import { QUERY_KEYS } from '~/constants/index';
import { API_URL } from '~/constants/api';
import { usePagination } from '~/composables/usePagination';
import { dateToYYYYMMDD, getCurrentDate, getSevenDaysOffset } from '~/utils/dateUtils';
import { PageChunks, type ProjectDetails, type RawProjectDetails, type RawProjectsMetaData } from '~/interfaces';
import { fetchProjectDetails } from '~/services/projectsService';

const itemsPerPageCookie = useCookie('itemsPerPage');
const requestedDateRangeCookie = useCookie('requestedDateRange');

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
};

const getDefaultRequestDate = () => {
  if (requestedDateRangeCookie.value) {
    return requestedDateRangeCookie.value;
  }
  return getSevenDaysOffset();
};

const onItemsPerPageChange = (value: number | string | null) => {
  itemsPerPage.value = value as number;
};

const getDefaultItemsPerPage = () => {
  if (itemsPerPageCookie.value) {
    return Number(itemsPerPageCookie.value);
  }
  return PageChunks.TEN;
};

const currPaginationPage = ref(1);
const itemsPerPage = ref<number>(getDefaultItemsPerPage());

const currentDate = ref(getCurrentDate());
const requestedDateRange = ref(getDefaultRequestDate());

const isModalOpen = ref(false);
const selectedProject = ref<ProjectDetails | null>(null);

const pageChunksValues = Object.values(PageChunks).filter(Number) as Array<number>;

watchEffect(() => {
  requestedDateRangeCookie.value = JSON.stringify(requestedDateRange.value);
});

watchEffect(() => {
  itemsPerPageCookie.value = JSON.stringify(itemsPerPage.value);
});

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

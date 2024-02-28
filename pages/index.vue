<template>
  <v-container fluid fill-height class="d-flex flex-column container-offset">
    <v-row justify="space-between" align="start">
      <!-- Left Side -->
      <v-col cols="12" md="1" class="mt-3">
        <v-date-picker class="elevation-6" color="primary"></v-date-picker>
      </v-col>
      
      <!-- Right Side -->
      <v-col cols="12" md="9">        
        <v-row class="right-side-scroll">
          <v-col cols="12" md="3" v-for="project in paginatedProjects" :key="project.id">
            <v-card class="my-4 elevation-6" outlined @click="handleCardClick(project.id)">
              <v-card-title tag="h6" class="headline font-weight-bold small-font">{{ project.name }}</v-card-title>
              <v-card-subtitle>{{ project.startDate }} - {{ project.endDate }}</v-card-subtitle>
              <v-card-text>{{ project.statusDescription }}</v-card-text>
              <v-card-actions>
                <v-btn color="primary" :href="project.website" target="_blank">Learn More</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- Pagination Component -->
    <v-pagination
    v-model="currentPage"
    :length="10"
    circle
  ></v-pagination>
  </v-container>
</template>

<style>
.container-offset {
  margin-top: 56px;
  height: calc(100vh - 56px);
}

.right-side-scroll {
  max-height: 100vh;
  overflow-y: auto;
}

.small-font {
  font-size: 14px !important;
}
</style>

<script setup lang="ts">
import { QUERY_KEYS } from '~/constants/index';
import { API_URL } from '~/constants/api';

interface ProjectsMetaData {
  acronym: string;
  lastUpdated: string;
  projectId: number;
  title: string;
  website: string;
}

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  releaseStatus: string;
  statusDescription: string;
  website: string;
}

const handleCardClick = (id: number) => {
  console.log('Card clicked', id);
};

const currentPage = ref(1);
const projectsList = ref<any[]>([]);

const {
  data: projectsMetaData,
  pending,
  error,
} = await useAsyncData<{ projects: ProjectsMetaData[] }>(
  QUERY_KEYS.PROJECTS_METADATA,
  () => $fetch(API_URL.PROJECTS,
    { query: { updatedSince: '2024-02-23' } }
  ),
)

watch(projectsMetaData, async newVal => {
  try {
    const projectDetailsPromises = newVal?.projects.map(project => (
      $fetch(`${API_URL.PROJECTS}/${project.projectId}`)
    ));
    projectsList.value = await Promise.all(projectDetailsPromises ?? []);
  } catch (error) {
    console.error('Error fetching project details', error);
  }
}, { immediate: true });

const projectsRestructured: globalThis.ComputedRef<Project[]> = computed(() => projectsList.value.map(item => ({
  id: item.project.projectId,
  name: item.project.title,
  startDate: item.project.startDateString,
  endDate: item.project.endDateString,
  releaseStatus: item.project.releaseStatusString,
  statusDescription: item.project.statusDescription,
  website: item.project.website,
})));

const paginatedProjects = computed(() => usePagination(projectsRestructured, 10));

</script>

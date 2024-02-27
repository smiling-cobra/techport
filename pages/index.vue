<template>
  <div v-if="error">
    <p>{{ error }}</p>
  </div>
  <v-container class="bg-surface-variant" fluid>
    <v-row>
      <v-col>
        <v-date-picker elevation="24" />
      </v-col>
      <v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

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
  name: string;
  startDate: string;
  endDate: string;
  releaseStatus: string;
  statusDescription: string;
  website: string;
}

const projectsList = ref<any[]>([]);

const {
  data: projectsMetaData,
  pending,
  error,
  refresh
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
    name: item.project.title,
    startDate: item.project.startDateString,
    endDate: item.project.endDateString,
    releaseStatus: item.project.releaseStatusString,
    statusDescription: item.project.statusDescription,
    website: item.project.website,
})));

const paginatedProjects = computed(() => usePagination(projectsRestructured, 10));

</script>

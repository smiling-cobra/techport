<template>
  <div v-if="error">
    <p>{{ error }}</p>
  </div>
  <div class="main-container"></div>
</template>

<script setup lang="ts">
import { QUERY_KEYS } from '~/constants/index';
import { API_URL } from '~/constants/api';

const {
  data: projectsMetaData,
  pending,
  error,
  refresh
} = await useAsyncData(
  QUERY_KEYS.PROJECTS_METADATA,
  () => $fetch(API_URL.PROJECTS, { query: { updatedSince: '2024-02-23', server: true } }),
)
</script>

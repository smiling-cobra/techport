<template>
    <v-card outlined class="pa-2 elevation-6" width="400">
    </v-card>
</template>

<script setup lang="ts">
    defineProps({
        coInvestigators: Array,
        leadOrganization: Object,
        supportingOrganizations: Array,
        principalInvestigators: Array,
        directors: Array,
        executives: Array,
        pms: Array,
        md: Object,
        title: String,
    });
</script>
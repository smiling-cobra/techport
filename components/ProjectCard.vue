<template>
    <v-card
        class="elevation-6"
        outlined
        @click="onClick && onClick(pid)"
    >
        <v-card-title tag="h6" class="headline font-weight-bold small-font">{{ name }}</v-card-title>
        <v-card-subtitle>{{ startDate }} - {{ endDate }}</v-card-subtitle>
        <v-card-text>{{ statusDescription }}</v-card-text>
        <v-card-actions>
            <v-btn color="primary" :href="website" target="_blank">Learn More</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
    defineProps({
        pid: Number,
        name: String,
        startDate: String,
        endDate: String,
        releaseStatus: String,
        statusDescription: String,
        website: String,
        onClick: Function
    });
</script>
<template>
    <v-card class="project-card" width="600">
        <div class="card-content">
            <h2 class="title">{{ project?.title }}</h2>
            <div v-if="project?.leadOrganization" class="section">
                <h3 class="section-title">Lead Organization</h3>
                <p class="organization-name">{{ project.leadOrganization.organizationName }}</p>
            </div>
            <div v-if="project?.supportingOrganizations?.length" class="section">
                <h3 class="section-title">Supporting Organizations</h3>
                <ul class="organization-list">
                    <li v-for="(org, index) in project.supportingOrganizations" :key="index">
                        {{ org.organizationName }}
                    </li>
                </ul>
            </div>
            <div v-if="project?.principalInvestigators?.length" class="section">
                <h3 class="section-title">Principal Investigators</h3>
                <ul class="person-list">
                    <li v-for="(pi, index) in project.principalInvestigators" :key="index">{{ pi.fullName }}</li>
                </ul>
            </div>
            <div v-if="project?.pms?.length" class="section">
                <h3 class="section-title">Project Managers</h3>
                <ul class="person-list">
                    <li v-for="(pm, index) in project.pms" :key="index">{{ pm.fullName }}</li>
                </ul>
            </div>
            <div v-if="project?.directors?.length" class="section">
                <h3 class="section-title">Directors</h3>
                <ul class="person-list">
                    <li v-for="(director, index) in project.directors" :key="index">{{ director.fullName }}</li>
                </ul>
            </div>
            <div v-if="project?.executives?.length" class="section">
                <h3 class="section-title">Executives</h3>
                <ul class="person-list">
                    <li v-for="(executive, index) in project.executives" :key="index">{{ executive.fullName }}</li>
                </ul>
            </div>
            <div v-if="project?.coInvestigators?.length" class="section">
                <h3 class="section-title">Co-Investigators</h3>
                <ul class="person-list">
                    <li v-for="(ci, index) in project.coInvestigators" :key="index">{{ ci.fullName }}</li>
                </ul>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { ProjectDetails } from '~/interfaces';

defineProps<{ project: ProjectDetails | null }>();
</script>

<style scoped>
.project-card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card-content {
    padding: 20px;
}

.title {
    margin-bottom: 16px;
    color: #333;
    font-weight: 600;
}

.section-title {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #555;
    font-size: 18px;
    font-weight: 600;
}

.organization-name,
.organization-list,
.person-list {
    margin-left: 20px;
}

.organization-list li,
.person-list li {
    list-style-type: disc;
    color: #666;
    margin-bottom: 5px;
}
</style>
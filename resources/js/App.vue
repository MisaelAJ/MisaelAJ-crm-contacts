<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
    await authStore.fetchUser();
});
</script>

<template>
    <div v-if="authStore.initialized">
        <router-view />
    </div>

    <div v-else class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
</template>
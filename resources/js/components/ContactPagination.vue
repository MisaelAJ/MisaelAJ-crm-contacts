<script setup lang="ts">
defineProps<{
    paginationData: any;
    currentPage: number;
    perPage: number;
}>();

const emit = defineEmits<{
    (e: "update:currentPage", value: number): void;
    (e: "update:perPage", value: number): void;
}>();

const updatePerPage = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    emit("update:perPage", Number(target.value));
};
</script>

<template>
    <div
        v-if="paginationData.meta"
        class="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4"
    >
        <div class="flex items-center gap-2 text-sm text-slate-500">
            <span>Show:</span>
            <select
                :value="perPage"
                @change="updatePerPage"
                class="bg-white border border-slate-200 rounded-lg px-2 py-1 focus:ring-0 focus:border-gray-400 outline-none"
            >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
            </select>
            <span>items</span>
        </div>

        <div
            class="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto text-sm"
        >
            <span class="text-slate-500 mr-4">
                Showing {{ paginationData.meta.from || 0 }} to
                {{ paginationData.meta.to || 0 }} of
                {{ paginationData.meta.total }}
            </span>

            <button
                :disabled="currentPage === 1"
                @click="emit('update:currentPage', currentPage - 1)"
                class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
                Previous
            </button>

            <div class="flex items-center gap-1">
                <span
                    class="px-3 py-1.5 bg-gray-800 text-white rounded-lg font-bold"
                >
                    {{ currentPage }}
                </span>
                <span class="text-slate-400 font-medium"
                    >/ {{ paginationData.meta.last_page }}</span
                >
            </div>

            <button
                :disabled="currentPage === paginationData.meta.last_page"
                @click="emit('update:currentPage', currentPage + 1)"
                class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
                Next
            </button>
        </div>
    </div>
</template>

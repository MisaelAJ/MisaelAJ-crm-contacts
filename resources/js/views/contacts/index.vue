<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { FolderIcon, PlusIcon, SearchIcon, FilterIcon, PencilIcon, TrashIcon } from 'lucide-vue-next';
import type { Contact } from '@/types';
import api from '@/api/axios';

const searchQuery = ref('');

const contacts = ref<Contact[]>([]);
const loading = ref(false);
const paginationData = ref({});
const currentPage = ref(1);

watch(searchQuery, (newValue) => {
    setTimeout(() => {
        fetchContacts(newValue);
    }, 500);
});

const fetchContacts = async (query: string) => {
    loading.value = true;
    try {
        const { data } = await api.get('/contacts', {
            params: {
                search: query,
                page: currentPage.value
            }
        });

        contacts.value = data.data;
        paginationData.value = data;
    } catch (error) {
        console.error("No se pudieron cargar los contactos");
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchContacts(searchQuery.value);
});
</script>

<template>
    <div class="min-h-screen bg-[#FDFDFD] text-slate-900">

        <nav class="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div class="max-w-7xl mx-auto px-6 lg:px-10">
                <div class="flex justify-between h-14 items-center">
                    <div class="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-800">
                        <span class="text-gray-800">
                            <FolderIcon />
                        </span>
                        <span>CRM Contact</span>
                    </div>
                    <div
                        class="size-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold cursor-pointer hover:ring-4 hover:ring-gray-100 transition-all">
                        M
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-6 lg:px-10 py-8">

            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-black text-gray-800 tracking-tight">Contacts</h1>
                <button
                    class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95">
                    <span class="text-lg">
                        <PlusIcon :size="16" />
                    </span>
                    New Contact
                </button>
            </div>

            <div class="flex flex-col md:flex-row gap-3 mb-6">
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span class="text-xl">
                            <SearchIcon :size="20" />
                        </span>
                    </span>
                    <input v-model="searchQuery" type="text" placeholder="Search by name, email or company..."
                        class="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-gray-400 focus:ring-0 transition-all outline-none" />
                </div>
                <div class="flex gap-2">
                    <button
                        class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <span class="text-lg">
                            <FilterIcon :size="20" />
                        </span>
                        Filters
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50 bg-slate-50/30">
                            <th class="px-6 py-4">Contact</th>
                            <th class="px-6 py-4">Email</th>
                            <th class="px-6 py-4">Phone</th>
                            <th class="px-6 py-4">Company</th>
                            <th class="px-6 py-4">Tags</th>
                            <th class="px-6 py-4">Notes</th>
                            <th class="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="contact in contacts" :key="contact.id"
                            class="group hover:bg-slate-50/50 transition-all">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <span class="font-bold text-sm text-gray-800">{{ contact.name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-500 font-medium">{{ contact.email }}</td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-500">
                                    {{ contact.phone }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-500 font-medium">{{ contact.company }}</td>
                            <td class="px-6 py-4 text-sm text-slate-500 font-medium">
                                <span v-for="tag in contact.tags" :key="tag"
                                    class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-500 mr-2">
                                    {{ tag }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-500 font-medium">{{ contact.notes }}</td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex justify-end gap-1 opacity-100 transition-opacity">
                                    <button
                                        class="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-gray-800 rounded-md transition-all">
                                        <span class="text-xl">
                                            <PencilIcon :size="20" />
                                        </span>
                                    </button>
                                    <button
                                        class="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all">
                                        <span class="text-xl">
                                            <TrashIcon :size="20" />
                                        </span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>
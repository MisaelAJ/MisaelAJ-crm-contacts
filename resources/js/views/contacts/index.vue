<script setup lang="ts">
import AdminLayout from "@/layouts/AdminLayout.vue";
import ContactPagination from "@/components/ContactPagination.vue";
import ContactFormModal from "@/components/ContactFormModal.vue";
import { useContacts } from "@/composables/useContacts";
import { useContactCrud } from "@/composables/useContactCrud";
import { formatDate } from "@/utils";
import {
    PlusIcon,
    SearchIcon,
    PencilIcon,
    TrashIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from "lucide-vue-next";

const {
    searchQuery,
    contacts,
    paginationData,
    currentPage,
    perPage,
    sort,
    dir,
    toggleSort,
    fetchContacts,
} = useContacts();

const {
    isModalOpen,
    formErrors,
    contactToEdit,
    openModal,
    closeModal,
    saveContact,
    deleteContact,
} = useContactCrud(fetchContacts);
</script>

<template>
    <AdminLayout>
        <div class="max-w-9/10 mx-auto px-6 lg:px-10 py-8">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-black text-gray-800 tracking-tight">
                    Contacts
                </h1>
                <button
                    @click="openModal()"
                    class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95"
                >
                    <span class="text-lg">
                        <PlusIcon :size="16" />
                    </span>
                    New Contact
                </button>
            </div>

            <div class="flex flex-col md:flex-row gap-3 mb-6">
                <div class="relative flex-1">
                    <span
                        class="absolute inset-y-0 left-3 flex items-center text-slate-400"
                    >
                        <span class="text-xl">
                            <SearchIcon :size="20" />
                        </span>
                    </span>
                    <input
                        v-model="searchQuery"
                        type="search"
                        placeholder="Search by name, email or company..."
                        class="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-gray-400 focus:ring-0 transition-all outline-none"
                    />
                </div>
            </div>

            <div
                class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
            >
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50 bg-slate-50/30"
                        >
                            <th
                                class="px-6 py-4 cursor-pointer hover:text-slate-600 transition-colors select-none"
                                @click="toggleSort('name')"
                            >
                                <div class="flex items-center gap-2">
                                    Contact
                                    <template v-if="sort === 'name'">
                                        <ArrowUpIcon
                                            v-if="dir === 'asc'"
                                            :size="14"
                                            class="text-gray-800"
                                        />
                                        <ArrowDownIcon
                                            v-else
                                            :size="14"
                                            class="text-gray-800"
                                        />
                                    </template>
                                </div>
                            </th>
                            <th class="px-6 py-4">
                                <div class="flex items-center gap-2">Email</div>
                            </th>
                            <th class="px-6 py-4">
                                <div class="flex items-center gap-2">Phone</div>
                            </th>
                            <th class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    Company
                                </div>
                            </th>
                            <th class="px-6 py-4">Tags</th>
                            <th
                                class="px-6 py-4 cursor-pointer hover:text-slate-600 transition-colors select-none"
                                @click="toggleSort('created_at')"
                            >
                                <div class="flex items-center gap-2">
                                    Created At
                                    <template v-if="sort === 'created_at'">
                                        <ArrowUpIcon
                                            v-if="dir === 'asc'"
                                            :size="14"
                                            class="text-gray-800"
                                        />
                                        <ArrowDownIcon
                                            v-else
                                            :size="14"
                                            class="text-gray-800"
                                        />
                                    </template>
                                </div>
                            </th>
                            <th class="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr
                            v-for="contact in contacts"
                            :key="contact.id"
                            class="group hover:bg-slate-50/50 transition-all"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="font-bold text-sm text-gray-800"
                                        >{{ contact.name }}</span
                                    >
                                </div>
                            </td>
                            <td
                                class="px-6 py-4 text-sm text-slate-500 font-medium"
                            >
                                {{ contact.email }}
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-500"
                                >
                                    {{ contact.phone }}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 text-sm text-slate-500 font-medium"
                            >
                                {{ contact.company }}
                            </td>
                            <td
                                class="px-6 py-4 text-sm text-slate-500 font-medium"
                            >
                                <span
                                    v-for="tag in contact.tags"
                                    :key="tag"
                                    class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-500 mr-2"
                                >
                                    {{ tag }}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 text-sm text-slate-500 font-medium"
                            >
                                {{ formatDate(contact.created_at) }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div
                                    class="flex justify-end gap-1 opacity-100 transition-opacity"
                                >
                                    <button
                                        @click="openModal(contact)"
                                        class="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-gray-800 rounded-md transition-all"
                                    >
                                        <span class="text-xl">
                                            <PencilIcon :size="20" />
                                        </span>
                                    </button>
                                    <button
                                        @click="deleteContact(contact.id!)"
                                        class="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all"
                                    >
                                        <span class="text-xl">
                                            <TrashIcon :size="20" />
                                        </span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr
                            v-if="contacts.length === 0"
                            class="hover:bg-slate-50/50 transition-all"
                        >
                            <td
                                class="px-6 py-4 text-sm text-slate-400 font-medium text-center"
                                colspan="7"
                            >
                                No results found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <ContactPagination
                v-if="paginationData.meta"
                :pagination-data="paginationData"
                :current-page="currentPage"
                :per-page="perPage"
                @update:current-page="currentPage = $event"
                @update:per-page="perPage = $event"
            />
        </div>

        <!-- Contact Modal -->
        <ContactFormModal
            v-if="isModalOpen"
            :contact-to-edit="contactToEdit"
            :form-errors="formErrors"
            @close="closeModal"
            @save="saveContact"
        />
    </AdminLayout>
</template>

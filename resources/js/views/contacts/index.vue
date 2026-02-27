<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
    FolderIcon,
    PlusIcon,
    SearchIcon,
    PencilIcon,
    TrashIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    UserIcon,
    XIcon,
    LogOutIcon,
} from "lucide-vue-next";
import type { Contact } from "@/types";
import api from "@/api/axios";

const searchQuery = ref("");

const contacts = ref<Contact[]>([]);
const loading = ref(false);
const paginationData = ref<any>({});
const currentPage = ref(1);
const perPage = ref(10);
const sort = ref("created_at");
const dir = ref("desc");

const isModalOpen = ref(false);
const isEditing = ref(false);
const formErrors = ref<Record<string, string[]>>({});

const currentContact = ref<Contact>({
    name: "",
    email: "",
    phone: "",
    company: "",
    tags: [] as string[],
    notes: "",
});
const tagsInput = ref("");

let searchTimeout: ReturnType<typeof setTimeout>;

watch([searchQuery, perPage, sort, dir], () => {
    currentPage.value = 1;
});

watch([searchQuery, currentPage, perPage, sort, dir], () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchContacts(searchQuery.value);
    }, 500);
});

const toggleSort = (column: string) => {
    if (sort.value === column) {
        dir.value = dir.value === "asc" ? "desc" : "asc";
    } else {
        sort.value = column;
        dir.value = "asc";
    }
};

const fetchContacts = async (query: string) => {
    loading.value = true;
    try {
        const { data } = await api.get("/contacts", {
            params: {
                q: query,
                page: currentPage.value,
                per_page: perPage.value,
                sort: sort.value,
                dir: dir.value,
            },
        });

        contacts.value = data.data;
        paginationData.value = data;
    } catch (error) {
        console.error("No se pudieron cargar los contactos");
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
};

onMounted(() => {
    fetchContacts(searchQuery.value);
});

const openModal = (contact: Contact | null = null) => {
    formErrors.value = {};
    if (contact) {
        isEditing.value = true;
        currentContact.value = { ...contact };
        // Ensure tags is array
        if (typeof currentContact.value.tags === "string") {
            try {
                currentContact.value.tags = JSON.parse(
                    currentContact.value.tags,
                );
            } catch {
                currentContact.value.tags = [];
            }
        } else if (!currentContact.value.tags) {
            currentContact.value.tags = [];
        }
        tagsInput.value = (currentContact.value.tags as string[]).join(", ");
    } else {
        isEditing.value = false;
        currentContact.value = {
            name: "",
            email: "",
            phone: "",
            company: "",
            tags: [],
            notes: "",
        };
        tagsInput.value = "";
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const saveContact = async () => {
    formErrors.value = {};
    const tagsArray = tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

    currentContact.value.tags = tagsArray;

    try {
        if (isEditing.value && currentContact.value.id) {
            await api.put(
                `/contacts/${currentContact.value.id}`,
                currentContact.value,
            );
        } else {
            await api.post("/contacts", currentContact.value);
        }
        closeModal();
        fetchContacts(searchQuery.value);
    } catch (error: any) {
        if (error.response && error.response.status === 422) {
            formErrors.value = error.response.data.errors;
        } else {
            console.error("Error saving contact", error);
        }
    }
};

const deleteContact = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
        await api.delete(`/contacts/${id}`);
        fetchContacts(searchQuery.value);
    } catch (error) {
        console.error("Error deleting contact", error);
    }
};

const isDropdownOpen = ref(false);

const logout = async () => {
    try {
        await api.post("/logout");
    } catch (error) {
        console.error("Logout failed", error);
    }
};
</script>

<template>
    <div class="min-h-screen bg-[#FDFDFD] text-slate-900">
        <nav
            class="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md"
        >
            <div class="max-w-full mx-auto px-6 lg:px-10">
                <div class="flex justify-between h-14 items-center">
                    <div
                        class="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-800"
                    >
                        <span class="text-gray-800">
                            <FolderIcon />
                        </span>
                        <span>CRM Contact</span>
                    </div>
                    <div class="relative">
                        <!-- Click outside overlay -->
                        <div
                            v-if="isDropdownOpen"
                            @click="isDropdownOpen = false"
                            class="fixed inset-0 z-40"
                        ></div>

                        <div
                            @click="isDropdownOpen = !isDropdownOpen"
                            class="relative z-50 size-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold cursor-pointer hover:ring-4 hover:ring-gray-100 transition-all"
                        >
                            <UserIcon :size="16" class="text-white" />
                        </div>

                        <div
                            v-if="isDropdownOpen"
                            class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 overflow-hidden transform origin-top-right transition-all"
                        >
                            <button
                                @click="logout"
                                class="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                                <LogOutIcon :size="16" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

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
            <div
                v-if="paginationData.meta"
                class="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4"
            >
                <div class="flex items-center gap-2 text-sm text-slate-500">
                    <span>Show:</span>
                    <select
                        v-model="perPage"
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
                        @click="currentPage--"
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
                        :disabled="
                            currentPage === paginationData.meta.last_page
                        "
                        @click="currentPage++"
                        class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Contact Modal -->
        <div
            v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div
                class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all"
            >
                <div
                    class="flex items-center justify-between px-6 py-4 border-b border-slate-100"
                >
                    <h3 class="text-lg font-bold text-gray-800">
                        {{ isEditing ? "Edit Contact" : "New Contact" }}
                    </h3>
                    <button
                        @click="closeModal"
                        class="text-slate-400 hover:text-gray-600 transition-colors"
                    >
                        <XIcon :size="20" />
                    </button>
                </div>

                <form @submit.prevent="saveContact" class="p-6">
                    <div class="space-y-4">
                        <div>
                            <label
                                class="block tracking-tight text-sm font-bold text-gray-700 mb-1"
                                >Name <span class="text-red-500">*</span></label
                            >
                            <input
                                v-model="currentContact.name"
                                type="text"
                                class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-gray-800 focus:bg-white focus:ring-0 outline-none transition-all"
                                required
                            />
                            <p
                                v-if="formErrors.name"
                                class="mt-1 text-xs text-red-500 font-medium"
                            >
                                {{ formErrors.name[0] }}
                            </p>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    class="block tracking-tight text-sm font-bold text-gray-700 mb-1"
                                    >Email
                                    <span class="text-red-500">*</span></label
                                >
                                <input
                                    v-model="currentContact.email"
                                    type="email"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-gray-800 focus:bg-white focus:ring-0 outline-none transition-all"
                                />
                                <p
                                    v-if="formErrors.email"
                                    class="mt-1 text-xs text-red-500 font-medium"
                                >
                                    {{ formErrors.email[0] }}
                                </p>
                            </div>
                            <div>
                                <label
                                    class="block tracking-tight text-sm font-bold text-gray-700 mb-1"
                                    >Phone</label
                                >
                                <input
                                    v-model="currentContact.phone"
                                    type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-gray-800 focus:bg-white focus:ring-0 outline-none transition-all"
                                />
                                <p
                                    v-if="formErrors.phone"
                                    class="mt-1 text-xs text-red-500 font-medium"
                                >
                                    {{ formErrors.phone[0] }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                class="block tracking-tight text-sm font-bold text-gray-700 mb-1"
                                >Company</label
                            >
                            <input
                                v-model="currentContact.company"
                                type="text"
                                class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-gray-800 focus:bg-white focus:ring-0 outline-none transition-all"
                            />
                            <p
                                v-if="formErrors.company"
                                class="mt-1 text-xs text-red-500 font-medium"
                            >
                                {{ formErrors.company[0] }}
                            </p>
                        </div>

                        <div>
                            <label
                                class="block tracking-tight text-sm font-bold text-gray-700 mb-1"
                                >Tags (comma separated)</label
                            >
                            <input
                                v-model="tagsInput"
                                type="text"
                                placeholder="client, urgent, new"
                                class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-gray-800 focus:bg-white focus:ring-0 outline-none transition-all"
                            />
                            <p
                                v-if="formErrors.tags"
                                class="mt-1 text-xs text-red-500 font-medium"
                            >
                                {{ formErrors.tags[0] }}
                            </p>
                        </div>

                        <div>
                            <label
                                class="block tracking-tight text-sm font-bold text-gray-700 mb-1"
                                >Notes</label
                            >
                            <textarea
                                v-model="currentContact.notes"
                                rows="3"
                                class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-gray-800 focus:bg-white focus:ring-0 outline-none transition-all block resize-none"
                            ></textarea>
                            <p
                                v-if="formErrors.notes"
                                class="mt-1 text-xs text-red-500 font-medium"
                            >
                                {{ formErrors.notes[0] }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100"
                    >
                        <button
                            type="button"
                            @click="closeModal"
                            class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
                        >
                            Save Contact
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

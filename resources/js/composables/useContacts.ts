import { ref, watch, onMounted } from "vue";
import type { Contact } from "@/types";
import api from "@/api/axios";

export function useContacts() {
    const searchQuery = ref("");
    const contacts = ref<Contact[]>([]);
    const loading = ref(false);
    const paginationData = ref<any>({});
    const currentPage = ref(1);
    const perPage = ref(10);
    const sort = ref("created_at");
    const dir = ref("desc");

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

    const fetchContacts = async (query?: string) => {
        const actualQuery = query !== undefined ? query : searchQuery.value;
        loading.value = true;
        try {
            const { data } = await api.get("/contacts", {
                params: {
                    q: actualQuery,
                    page: currentPage.value,
                    per_page: perPage.value,
                    sort: sort.value,
                    dir: dir.value,
                },
            });

            contacts.value = data.data;
            paginationData.value = data;
        } catch (error) {
            console.error("No se pudieron cargar los contactos", error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchContacts(searchQuery.value);
    });

    return {
        searchQuery,
        contacts,
        loading,
        paginationData,
        currentPage,
        perPage,
        sort,
        dir,
        toggleSort,
        fetchContacts,
    };
}

import { ref } from "vue";
import type { Contact } from "@/types";
import api from "@/api/axios";

export function useContactCrud(
    fetchContacts: (query?: string) => Promise<void>,
) {
    const isModalOpen = ref(false);
    const formErrors = ref<Record<string, string[]>>({});
    const contactToEdit = ref<Contact | null>(null);

    const openModal = (contact: Contact | null = null) => {
        formErrors.value = {};
        contactToEdit.value = contact;
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
    };

    const saveContact = async (contactData: Contact, tagsInputStr: string) => {
        formErrors.value = {};
        const tagsArray = tagsInputStr
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        contactData.tags = tagsArray;

        try {
            if (contactData.id) {
                await api.put(`/contacts/${contactData.id}`, contactData);
            } else {
                await api.post("/contacts", contactData);
            }
            closeModal();
            fetchContacts();
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
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact", error);
        }
    };

    return {
        isModalOpen,
        formErrors,
        contactToEdit,
        openModal,
        closeModal,
        saveContact,
        deleteContact,
    };
}

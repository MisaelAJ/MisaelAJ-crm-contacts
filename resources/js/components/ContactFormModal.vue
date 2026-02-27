<script setup lang="ts">
import { ref } from "vue";
import { XIcon } from "lucide-vue-next";
import type { Contact } from "@/types";

const props = defineProps<{
    contactToEdit: Contact | null;
    formErrors: Record<string, string[]>;
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "save", contact: Contact, tagsInput: string): void;
}>();

const isEditing = ref(!!props.contactToEdit);
const currentContact = ref<Contact>({
    name: "",
    email: "",
    phone: "",
    company: "",
    tags: [],
    notes: "",
});
const tagsInput = ref("");

if (props.contactToEdit) {
    currentContact.value = { ...props.contactToEdit };
    if (typeof currentContact.value.tags === "string") {
        try {
            currentContact.value.tags = JSON.parse(currentContact.value.tags);
        } catch {
            currentContact.value.tags = [];
        }
    } else if (!currentContact.value.tags) {
        currentContact.value.tags = [];
    }
    tagsInput.value = (currentContact.value.tags as string[]).join(", ");
}

const submit = () => {
    emit("save", currentContact.value, tagsInput.value);
};
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="emit('close')"
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
                    @click="emit('close')"
                    class="text-slate-400 hover:text-gray-600 transition-colors"
                >
                    <XIcon :size="20" />
                </button>
            </div>

            <form @submit.prevent="submit" class="p-6">
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
                        @click="emit('close')"
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FolderIcon, UserIcon, LogOutIcon } from "lucide-vue-next";
import api from "@/api/axios";

const isDropdownOpen = ref(false);

const logout = async () => {
    try {
        await api.post("/logout");
        window.location.href = "/login";
    } catch (error) {
        console.error("Logout failed", error);
        window.location.href = "/login";
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

        <slot />
    </div>
</template>

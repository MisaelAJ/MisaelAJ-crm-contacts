<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const form = ref({
    email: 'test@example.com',
    password: 'password'
});

const error = ref('');

const handleLogin = async () => {
    try {
        await auth.login(form.value);
        router.push({ name: 'contacts.index' });
    } catch (e: any) {
        error.value = 'Credenciales inválidas';
    }
};
</script>

<template>
    <section class="bg-gray-50">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <span class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                CRM Contacts
            </span>
            <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
                            <input v-model="form.email" type="email" required
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
                            <input v-model="form.password" type="password" required
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                        </div>
                        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

                        <button type="submit" :disabled="auth.loading"
                            class="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 disabled:opacity-50 cursor-pointer">
                            {{ auth.loading ? 'Iniciando Sesión...' : 'Iniciar Sesión' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
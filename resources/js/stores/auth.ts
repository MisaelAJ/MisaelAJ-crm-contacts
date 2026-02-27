import { defineStore } from 'pinia';
import api from '@/api/axios';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: localStorage.getItem('auth_token') || null,
        loading: false,
        initialized: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials: any) {
            this.loading = true;
            try {
                const response = await api.post('/login', credentials);
                this.user = response.data.user;
                this.token = response.data.access_token;
                localStorage.setItem('auth_token', response.data.access_token);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            try {
                if (localStorage.getItem('auth_token')) {
                    await api.post('/logout');
                }
            } catch (error) {
                throw error;
            } finally {
                this.token = null;
                this.user = null;
                localStorage.removeItem('auth_token');
                this.loading = false;
                window.location.href = '/login';
            }
        },
        async fetchUser() {
            const token = localStorage.getItem('auth_token');
            
            if (!token || token === 'undefined' || token === 'null') {
                this.user = null;
                this.initialized = true;
                return;
            }

            this.loading = true;
            try {
                const { data } = await api.get('/me');
                this.user = data;
            } catch (error) {
                this.logout();
                throw error;
            } finally {
                this.initialized = true; 
                this.loading = false;
            }
        }
    },
});
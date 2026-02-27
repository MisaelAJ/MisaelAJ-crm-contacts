import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '../views/login.vue';
import ContactsIndex from '../views/contacts/index.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { guest: true }
        },
        {
            path: '/contacts',
            name: 'contacts.index',
            component: ContactsIndex,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/',
            redirect: '/contacts'
        }
    ],
});

router.beforeEach(async (to, from) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: 'login' };
    }

    if (to.meta.guest && auth.isAuthenticated) {
        return { name: 'contacts.index' };
    }
    return true;
});

export default router;
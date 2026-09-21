import { createMemoryHistory, createRouter } from 'vue-router';

import HomeView from './views/HomeView.vue';
import JarUploadView from './views/JarUploadView.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/jar-upload', component: JarUploadView },
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

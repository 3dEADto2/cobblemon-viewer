<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';

import TheExperience from './components/TheExperience.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);
</script>

<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/jar-upload">JarUpload</RouterLink>
    </nav>
    <main class="p-2">
        <RouterView></RouterView>
    </main>
</template>

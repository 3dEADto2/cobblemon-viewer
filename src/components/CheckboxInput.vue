<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { ref, onMounted, inject, onUnmounted, type Ref, computed } from 'vue';
import {
    type FormContext,
    type FormFieldData,
    type InputOptions,
} from './../types';

const { title } = defineProps<{
    title?: string;
}>();

const inputVal = ref(false);

const emit = defineEmits<{
    (e: 'update', data: boolean): void;
}>();
</script>

<template>
    <div
        class="flex items-center border border-secondary rounded px-1 gap-1 w-fit"
    >
        <p class="font-semibold">{{ title }}:</p>
        <div
            class="relative flex justify-center items-center size-fit cursor-pointer"
        >
            <FontAwesomeIcon
                class="text-xl"
                :icon="inputVal ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"
            />
            <input
                type="checkbox"
                v-model="inputVal"
                @change="emit('update', inputVal)"
                class="absolute size-full cursor-pointer opacity-0"
            />
        </div>
    </div>
</template>

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

const emit = defineEmits<{
    (e: 'update', data: boolean): void;
}>();

const inputVal = ref(false);

// TODO: should also be possible to return undefined, maybe something like checkmark, X, blank
</script>

<template>
    <div
        class="flex items-center border border-secondary rounded p-1 gap-1 w-fit h-fit"
    >
        <p class="font-semibold">{{ title }}:</p>
        <div
            class="relative flex justify-center items-center size-fit cursor-pointer"
        >
            <FontAwesomeIcon
                class="text-2xl"
                :icon="inputVal ? 'fa-solid fa-square-check' : 'fa-solid fa-square'"
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

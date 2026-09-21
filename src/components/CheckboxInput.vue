<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { ref, onMounted, inject, onUnmounted, type Ref, computed } from 'vue';
import {
    type FormContext,
    type FormFieldData,
    type InputOptions,
} from './../types';

const { keyVal, initValue, options } = defineProps<{
    options: InputOptions;
    keyVal?: string;
    initValue?: boolean;
}>();

const form = inject(options?.registerAt ?? '', null) as FormContext | null;

const inputVal = ref(initValue ? true : false);
const data: FormFieldData = {
    key: keyVal ?? 'unknown',
    value: inputVal,
    updated: false,
};

onMounted(() => {
    if (!form) return;
    form.register(data);
});

onUnmounted(() => {
    if (!form) return;
    form.unregister(data);
});
</script>

<template>
    <div
        class="flex items-center border border-secondary rounded px-1 gap-1 w-fit"
    >
        <p class="font-semibold">{{ keyVal }}:</p>
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
                @change="data.updated = true"
                class="absolute size-full cursor-pointer opacity-0"
            />
        </div>
    </div>
</template>

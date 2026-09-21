<script lang="ts" setup>
import { ref, onMounted, useSlots, provide, type Ref } from 'vue';
import { type FormContext, type FormFieldData } from './../types';

const { registerKey } = defineProps<{
    registerKey: string;
    submitBtnName?: string;
}>();

const registeredFields: Set<FormFieldData> = new Set();

const emit = defineEmits<{
    (e: 'submit', data: Set<FormFieldData>): void;
}>();

provide(registerKey, {
    register: (fieldData: FormFieldData) => {
        registeredFields.add(fieldData);
    },
    unregister: (fieldData: FormFieldData) => {
        registeredFields.delete(fieldData);
    },
});
</script>

<template>
    <div class="flex flex-col gap-1">
        <slot></slot>
        <button
            @click="emit('submit', registeredFields)"
            type="button"
            class="bg-secondary text-base rounded px-1 font-semibold active:bg-secondary/80 cursor-pointer uppercase"
        >
            {{ submitBtnName ?? 'SUBMIT' }}
        </button>
    </div>
</template>

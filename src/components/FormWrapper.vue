<script lang="ts" setup>
import { ref, onMounted, useSlots, provide, type Ref } from 'vue';
import { FormContext, FormFieldData } from './../types';
import Utils from './../utils/utils';

const { registerKey } = defineProps<{
    registerKey: string;
    submitBtnName?: string;
}>();

const registeredFields: Set<FormFieldData> = new Set();

const onSubmit = () => {
    console.log(registeredFields);
    return;
    const result = Utils.normalizeFormFieldData(Array.from(registeredFields));
    console.log(result);
};

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
    <form @submit.prevent="onSubmit()" class="flex flex-col gap-1">
        <slot></slot>
        <button
            type="submit"
            class="bg-secondary text-base rounded px-1 font-semibold active:bg-secondary/80 cursor-pointer uppercase"
        >
            {{ submitBtnName ?? 'SUBMIT' }}
        </button>
    </form>
</template>

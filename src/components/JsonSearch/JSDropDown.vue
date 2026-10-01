<script lang="ts" setup>
import { type SearchParameters } from './../../types';
import SearchDropDown from './../SearchDropDown.vue';
import { ref } from 'vue';

const { title, values, onKeyStroke, type } = defineProps<{
    type: 'string' | 'number' | 'number_or_string';
    title?: string;
    values?: any[];
    onKeyStroke?: boolean;
}>();

const operatorValues =
    type === 'number'
        ? ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte']
        : ['equals', 'notEquals', 'includes', 'regex'];
const operatorValue = ref<string | undefined>();
const selectedValue = ref<string | number | undefined>();

const emit = defineEmits<{
    (e: 'update', data: SearchParameters | undefined): void;
}>();

const updateHandler = () => {
    let result = undefined;

    if (
        operatorValues.includes(operatorValue.value ?? '') &&
        selectedValue.value !== undefined &&
        selectedValue.value !== ''
    ) {
        result = {
            operator: operatorValue.value,
            value: selectedValue.value,
        } as SearchParameters;
    }

    emit('update', result);
};

const onSelectedHandler = (data: string | number | undefined) => {
    selectedValue.value = data;

    updateHandler();
};

const onOperatorHandler = (data: string | number | undefined) => {
    operatorValue.value = typeof data === 'number' ? undefined : data;

    updateHandler();
};
</script>

<template>
    <div class="flex gap-1">
        <SearchDropDown
            :title="title"
            :values="values"
            :on-key-stroke="onKeyStroke"
            @update="onSelectedHandler"
        />
        <SearchDropDown
            :title="'SearchParameter'"
            :values="operatorValues"
            :on-key-stroke="true"
            @update="onOperatorHandler"
        />
    </div>
</template>

<script lang="ts" setup>
import { type SearchParameters } from './../../types';
import SearchDropDown from './../SearchDropDown.vue';
import { ref, computed } from 'vue';

const { title, values, onKeyStroke, type } = defineProps<{
    type: 'string' | 'number' | 'number_or_string';
    title?: string;
    values?: any[];
    onKeyStroke?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update', data: SearchParameters | undefined): void;
}>();

const operatorValues =
    type === 'number'
        ? ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte']
        : ['equals', 'notEquals', 'includes', 'regex'];
const operatorValue = ref<string | undefined>();
const selectedValue = ref<string | number | undefined>();

const isValid = computed(() => {
    return (
        operatorValues.includes(operatorValue.value ?? '') &&
        selectedValue.value !== undefined &&
        selectedValue.value !== ''
    );
})

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
    <div class="flex border rounded" :class="{ 'border-green-500': isValid, 'border-secondary': !isValid }">
        <div class="border-r border-secondary pr-1 mr-1">
            <SearchDropDown
                :title="title"
                :values="values"
                :options="{ onKeyStroke }"
                @update="onSelectedHandler"
                class="border-none"
            />
        </div>
        <SearchDropDown
            :title="'OP'"
            :values="operatorValues"
            :options="{ inputDisabled: true }"
            @update="onOperatorHandler"
            class="border-none"
        />
    </div>
</template>

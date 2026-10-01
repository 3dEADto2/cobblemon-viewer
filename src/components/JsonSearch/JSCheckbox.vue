<script lang="ts" setup>
import { type SearchParameters } from './../../types';
import SearchDropDown from './../SearchDropDown.vue';
import CheckboxInput from './../CheckboxInput.vue';
import { ref } from 'vue';

const { title } = defineProps<{
    title?: string;
}>();

const operatorValues = ['equals', 'notEquals'];
const operatorValue = ref<string | undefined>();
const selectedValue = ref(false);

const emit = defineEmits<{
    (e: 'update', data: SearchParameters | undefined): void;
}>();

const updateHandler = () => {
    let result = undefined;

    if (operatorValues.includes(operatorValue.value ?? '')) {
        result = {
            operator: operatorValue.value,
            value: selectedValue.value,
        } as SearchParameters;
    }

    emit('update', result);
};

const onSelectedHandler = (data: boolean) => {
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
        <CheckboxInput :title="title" @update="onSelectedHandler" />
        <SearchDropDown
            :title="'SearchParameter'"
            :values="operatorValues"
            :on-key-stroke="true"
            @update="onOperatorHandler"
        />
    </div>
</template>

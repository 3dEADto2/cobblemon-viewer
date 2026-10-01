<script lang="ts" setup>
import JSDropDown from './JSDropDown.vue';
import SearchDropDown from './../SearchDropDown.vue';
import JSObjectSelect from './JSObjectSelect.vue';
import { JsonMerger, type SchemaNode } from './../../utils/jsonMerger.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { ref, computed } from 'vue';
import {
    type SearchParameters,
} from './../../types';

const { schemaNode, jsonMerger, title } = defineProps<{
    title?: string;
    schemaNode: SchemaNode;
    jsonMerger: JsonMerger;
}>();

const emit = defineEmits<{
    (e: 'update', data: SearchParameters | undefined): void;
}>();

const operatorValues = ['every', 'some', 'none'];
const operatorValue = ref<string | undefined>();

const selectedValue = ref<Map<string, any>>(new Map());
const shownSelectedKey = ref<string | undefined>();

const validSelectedValue = computed(() => {
    return Array.from(selectedValue.value.values()).filter((el) => el !== undefined && el !== null);
})

const isValid = computed(() => {
    return (
        operatorValues.includes(operatorValue.value ?? '') &&
        validSelectedValue.value.length > 0
    );
})

const updateHandler = () => {
    let result: SearchParameters | undefined = undefined;

    if (isValid.value) {
        result = {
            operator: operatorValue.value,
            value: validSelectedValue.value
        } as SearchParameters
    }

    emit('update', result);
}

const onOperatorHandler = (data: string | number | undefined) => {
    operatorValue.value = typeof data === 'number' ? undefined : data;

    updateHandler();
};

const addSelectedValue = (data: any) => {
    const key = crypto.randomUUID();
    selectedValue.value.set(key, data);
    shownSelectedKey.value = key;

    updateHandler();
}

const removeSelectedValue = (key: string) => {
    selectedValue.value.delete(key);
    if (shownSelectedKey.value === key) {
        shownSelectedKey.value = selectedValue.value.keys().next().value;
    }

    updateHandler();
}

const dropDownAddHandler = (data: SearchParameters | undefined) => {
    if (!data) return;
    addSelectedValue(data);

    updateHandler();
}

const onObjectUpdateHandler = (key: string, data: Record<string, any> | undefined) => {
    selectedValue.value.set(key, data);

    updateHandler();
}
</script>

<template>
    <div class="border rounded" :class="{ 'border-green-500': isValid, 'border-secondary': !isValid }">
        <div
            class="flex gap-1 items-center border-b border-r border-secondary rounded-br w-fit text-lg font-semibold"
        >
            <SearchDropDown
                class="border-none"
                :title="title"
                :values="operatorValues"
                :options="{ inputDisabled: true }"
                @update="onOperatorHandler"
            />
            <button
                v-if="schemaNode.items?.type === 'object'"
                type="button"
                class="cursor-pointer px-1"
                @click="addSelectedValue(undefined)"
            >
                <FontAwesomeIcon class="text-xl" icon="fa-solid fa-plus" />
            </button>
        </div>
        <div class="flex flex-col gap-1 p-3">
            <template
                v-if="
                    schemaNode.items?.type === 'number' ||
                    schemaNode.items?.type === 'string' ||
                    schemaNode.items?.type === 'number_or_string'
                "
            >
                <div class="flex gap-1 flex-wrap">
                    <button
                        v-for="([mapKey, mapValue], index) of Array.from(selectedValue.entries())"
                        :key="mapKey"
                        class="border border-green-500 rounded px-1 cursor-pointer hover:border-red-500 hover:line-through max-w-30 truncate"
                        type="button"
                        @click="removeSelectedValue(mapKey)"
                    >
                        {{ mapValue}}
                    </button>
                </div>
                <JSDropDown
                    v-if="
                        schemaNode.items?.type === 'number' ||
                        schemaNode.items?.type === 'string' ||
                        schemaNode.items?.type === 'number_or_string'
                    "
                    :type="schemaNode.items.type"
                    :values="Array.from(schemaNode.items?.values ?? [])"
                    @update="dropDownAddHandler"
                />
            </template>
            <template v-if="schemaNode.items?.type === 'object'">
                <div class="flex gap-1">
                    <button
                        v-for="([mapKey, mapValue], index) of Array.from(selectedValue.entries())"
                        :key="mapKey"
                        :class="{
                            'border-green-500': mapKey === shownSelectedKey,
                            'border-secondary': mapKey !== shownSelectedKey,
                        }"
                        class="border rounded px-2 cursor-pointer hover:border-green-500"
                        type="button"
                        @click="shownSelectedKey = mapKey"
                    >
                        {{ index + 1 }}
                    </button>
                </div>
                <template
                    v-for="([mapKey, mapValue], index) of Array.from(selectedValue.entries())"
                    :key="mapKey"
                >
                    <JSObjectSelect
                        :class="{ hidden: mapKey !== shownSelectedKey }"
                        :json-merger="jsonMerger"
                        :parent-node="schemaNode.items"
                        :can-be-destroyed="true"
                        @close="removeSelectedValue(mapKey)"
                        @update="(input) => onObjectUpdateHandler(mapKey, input)"
                    />
                </template>
            </template>
        </div>
    </div>
</template>

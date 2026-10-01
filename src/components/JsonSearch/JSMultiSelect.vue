<script lang="ts" setup>
import JSDropDown from './JSDropDown.vue';
import SearchDropDown from './../SearchDropDown.vue';
import JSObjectSelect from './JSObjectSelect.vue';
import { JsonMerger, type SchemaNode } from './../../utils/jsonMerger.js';
import Utils from './../../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { ref, onMounted, inject, onUnmounted, type Ref, computed } from 'vue';
import {
    type FormContext,
    type FormFieldData,
    type SearchParameters,
} from './../../types';

const { schemaNode, jsonMerger, title } = defineProps<{
    title?: string;
    schemaNode: SchemaNode;
    jsonMerger: JsonMerger;
}>();

const operatorValues = ['every', 'some', 'none'];
const operatorValue = ref<string | undefined>();
const selectedValue = ref<{ _id: string; data: any }[]>([]);
let childModel: Record<string, any> | undefined = undefined;
const shownIndex = ref(0);

const emit = defineEmits<{
    (e: 'update', data: SearchParameters | undefined): void;
}>();

const updateHandler = () => {
    let result = undefined;

    if (
        operatorValues.includes(operatorValue.value ?? '') &&
        selectedValue.value.length
    ) {
        result = {
            operator: operatorValue.value,
            value: selectedValue.value.map((el) => el.data),
        } as SearchParameters;
    }

    console.log(result, selectedValue.value);
    emit('update', result);
};

const onOperatorHandler = (data: string | number | undefined) => {
    operatorValue.value = typeof data === 'number' ? undefined : data;

    updateHandler();
};

const searchDropDownHandler = (input: SearchParameters | undefined) => {
    if (!input) return;

    selectedValue.value.push({
        _id: crypto.randomUUID(),
        data: input,
    });

    updateHandler();
};

const addObjectSelect = () => {
    if (!childModel) return;

    const newChildModel = JSON.parse(JSON.stringify(childModel));
    selectedValue.value.push({
        _id: crypto.randomUUID(),
        data: newChildModel,
    });

    updateHandler();

    shownIndex.value = selectedValue.value.length - 1;
};

const removeItem = (index: number) => {
    if (index >= selectedValue.value.length - 1) {
        shownIndex.value = index - 1;
    }

    selectedValue.value.splice(index, 1);

    updateHandler();
};

onMounted(() => {
    if (schemaNode.items?.type === 'object' && schemaNode.items) {
        const result = jsonMerger.createModelBySchemaNode(schemaNode.items);

        if (!Array.isArray(result)) {
            childModel = result;
        }
    }
});
</script>

<template>
    <div class="flex gap-1">
        <div class="border border-secondary rounded">
            <div
                class="flex gap-1 items-center border-b border-r border-secondary rounded-br w-fit px-1 text-lg font-semibold"
            >
                <h4>
                    {{ title }}
                </h4>
                <button
                    v-if="schemaNode.items?.type === 'object'"
                    type="button"
                    class="cursor-pointer"
                    @click="addObjectSelect()"
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
                    <div class="flex gap-1">
                        <button
                            v-for="(item, index) of selectedValue"
                            class="border border-green-500 rounded px-1 cursor-pointer hover:border-red-500 hover:line-through max-w-30 truncate"
                            type="button"
                            @click="selectedValue.splice(index, 1)"
                        >
                            {{ item.data?.value }}
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
                        @update="searchDropDownHandler"
                    />
                </template>
                <template v-if="schemaNode.items?.type === 'object'">
                    <div class="flex gap-1">
                        <button
                            v-for="(item, index) of selectedValue"
                            :key="item._id"
                            :class="{
                                'border-green-500': index === shownIndex,
                                'border-secondary': index !== shownIndex,
                            }"
                            class="border rounded px-2 cursor-pointer hover:border-green-500"
                            type="button"
                            @click="shownIndex = index"
                        >
                            {{ index + 1 }}
                        </button>
                    </div>
                    <template
                        v-for="(item, index) of selectedValue"
                        :key="item._id"
                    >
                        <JSObjectSelect
                            :class="{ hidden: index !== shownIndex }"
                            :json-merger="jsonMerger"
                            :parent-node="schemaNode.items"
                            :parent-result-model="item.data"
                            :can-be-destroyed="true"
                            @close="removeItem(index)"
                            @update="updateHandler()"
                        />
                    </template>
                </template>
            </div>
        </div>
        <SearchDropDown
            :title="'SearchParameter'"
            :values="operatorValues"
            :on-key-stroke="true"
            @update="onOperatorHandler"
        />
    </div>
</template>

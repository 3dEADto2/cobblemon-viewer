<script lang="ts" setup>
import SearchDropDown from './SearchDropDown.vue';
import ObjectSelect from './ObjectSelect.vue';
import { JsonMerger, type SchemaNode } from './../utils/jsonMerger.js';
import JsonSelection from './JsonSelection.vue';
import NoFormWrapper from './NoFormWrapper.vue';
import Utils from './../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { ref, onMounted, inject, onUnmounted, type Ref, computed } from 'vue';
import { type FormContext, type FormFieldData } from './../types';

const { schemaNode, jsonMerger, title } = defineProps<{
    title?: string;
    schemaNode: SchemaNode;
    jsonMerger: JsonMerger;
}>();

const emit = defineEmits<{
    (e: 'update', data: any[] | undefined): void;
}>();

let childModel: Record<string, any> | undefined = undefined;
const created = ref<{ _id: string; data: any }[]>([]);
const shownIndex = ref(0);

const searchDropDownHandler = (input: string | number | undefined) => {
    created.value.push({
        _id: crypto.randomUUID(),
        data: input,
    });

    emit(
        'update',
        created.value.map((el) => el.data),
    );
};

const addObjectSelect = () => {
    if (!childModel) return;

    const newChildModel = JSON.parse(JSON.stringify(childModel));
    created.value.push({
        _id: crypto.randomUUID(),
        data: newChildModel,
    });

    emit(
        'update',
        created.value.map((el) => el.data),
    );

    shownIndex.value = created.value.length - 1;
};

const removeItem = (index: number) => {
    if (index >= created.value.length - 1) {
        shownIndex.value = index - 1;
    }

    created.value.splice(index, 1);

    let result = undefined;

    if (created.value.length) {
        result = created.value.map((el) => el.data);
    }

    emit('update', result);
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
                        v-for="(item, index) of created"
                        class="border border-green-500 rounded px-1 cursor-pointer hover:border-red-500 hover:line-through max-w-30 truncate"
                        type="button"
                        @click="created.splice(index, 1)"
                    >
                        {{ item.data }}
                    </button>
                </div>
                <SearchDropDown
                    v-if="
                        schemaNode.items?.type === 'number' ||
                        schemaNode.items?.type === 'string' ||
                        schemaNode.items?.type === 'number_or_string'
                    "
                    :values="Array.from(schemaNode.items?.values ?? [])"
                    @update="searchDropDownHandler"
                />
            </template>
            <template v-if="schemaNode.items?.type === 'object'">
                <div class="flex gap-1">
                    <button
                        v-for="(item, index) of created"
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
                <template v-for="(item, index) of created" :key="item._id">
                    <ObjectSelect
                        :class="{ hidden: index !== shownIndex }"
                        :json-merger="jsonMerger"
                        :parent-node="schemaNode.items"
                        :parent-result-model="item.data"
                        :can-be-destroyed="true"
                        @close="removeItem(index)"
                    />
                </template>
            </template>
        </div>
    </div>
</template>

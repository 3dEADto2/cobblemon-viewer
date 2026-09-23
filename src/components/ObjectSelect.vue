<script lang="ts" setup>
import SearchDropDown from './SearchDropDown.vue';
import CheckboxInput from './CheckboxInput.vue';
import {
    type JsonMergerResult,
    type SchemaNode,
    JsonMerger,
} from './../utils/jsonMerger';
import { unref } from 'vue';

const { parentNode, title, jsonMerger, parentResultModel } = defineProps<{
    parentNode: SchemaNode;
    parentResultModel: Record<string, any>;
    jsonMerger: JsonMerger;
    title?: string;
}>();

console.log(parentNode, parentResultModel);
</script>

<template>
    <div>
        <div>
            <h1>{{ title }}</h1>
        </div>
        <div v-if="parentNode.properties" class="flex flex-col gap-1">
            <template
                v-for="([schemaKey, schemaNode], index) of Object.entries(
                    parentNode.properties,
                ).sort(([aKey, _a], [bKey, _b]) => (aKey > bKey ? 1 : -1))"
            >
                <SearchDropDown
                    v-if="
                        schemaNode.type === 'number' ||
                        schemaNode.type === 'string' ||
                        schemaNode.type === 'number_or_string'
                    "
                    :title="schemaKey"
                    :values="Array.from(schemaNode.values!)"
                    @update="(input) => (parentResultModel[schemaKey] = input)"
                />
                <CheckboxInput
                    v-if="schemaNode.type === 'boolean'"
                    :title="schemaKey"
                    @update="(input) => (parentResultModel[schemaKey] = input)"
                />
                <ObjectSelect
                    v-if="schemaNode.type === 'object'"
                    :json-merger="jsonMerger"
                    :parent-node="schemaNode"
                    :parent-result-model="parentResultModel[schemaKey]"
                    :title="schemaKey"
                />
            </template>
        </div>
    </div>
</template>

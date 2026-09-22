<script lang="ts" setup>
import SearchDropDown from './SearchDropDown.vue';
import {
    type JsonMergerResult,
    type SchemaNode,
    JsonMerger,
} from './../utils/jsonMerger';
import { unref } from 'vue';

const { jsonMerger } = defineProps<{
    jsonMerger: JsonMerger;
}>();

const resultModel = jsonMerger.createInitialModel(jsonMerger.Result);
</script>

<template>
    <div>
        <div>
            <h1>CardHeader</h1>
            <button @click="console.log(resultModel)">CLICKME</button>
        </div>
        <div class="flex flex-col gap-1">
            <template
                v-for="([schemaKey, schemaNode], index) of Object.entries(
                    jsonMerger.Result,
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
                    @update="(input) => (resultModel[schemaKey] = input)"
                />
            </template>
        </div>
    </div>
</template>

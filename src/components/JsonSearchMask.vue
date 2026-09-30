<script lang="ts" setup>
import SearchDropDown from './SearchDropDown.vue';
import CheckboxInput from './CheckboxInput.vue';
import ObjectSelect from './ObjectSelect.vue';
import MultiSelect from './MultiSelect.vue';
import {
    type JsonMergerResult,
    type SchemaNode,
    JsonMerger,
} from './../utils/jsonMerger';
import { unref } from 'vue';

const { jsonMerger } = defineProps<{
    jsonMerger: JsonMerger;
}>();

const emit = defineEmits<{
    (e: 'submit', data: { isEmpty: boolean; model: any }): void;
}>();

const resultModel = jsonMerger.createInitialModel(jsonMerger.Result);

const submit = () => {
    const cleaned = jsonMerger.removeUnusedFromModel(resultModel);
    emit('submit', cleaned);
};
</script>

<template>
    <div>
        <div>
            <h1>CardHeader</h1>
            <button @click="submit()">submit</button>
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
                    :on-key-stroke="true"
                    @update="(input) => (resultModel[schemaKey] = input)"
                />
                <CheckboxInput
                    v-if="schemaNode.type === 'boolean'"
                    :title="schemaKey"
                    @update="(input) => (resultModel[schemaKey] = input)"
                />
                <ObjectSelect
                    v-if="schemaNode.type === 'object'"
                    :title="schemaKey"
                    :json-merger="jsonMerger"
                    :parent-node="schemaNode"
                    :parent-result-model="resultModel[schemaKey]"
                />
                <MultiSelect
                    v-if="schemaNode.type === 'array'"
                    :title="schemaKey"
                    :schema-node="schemaNode"
                    :result-model="resultModel[schemaKey]"
                    :json-merger="jsonMerger"
                />
            </template>
        </div>
    </div>
</template>

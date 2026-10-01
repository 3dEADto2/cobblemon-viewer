<script lang="ts" setup>
import JSDropDown from './JSDropDown.vue';
import JSCheckbox from './JSCheckbox.vue';
import JSObjectSelect from './JSObjectSelect.vue';
import JSMultiSelect from './JSMultiSelect.vue';
import {
    type JsonMergerResult,
    type SchemaNode,
    JsonMerger,
} from './../../utils/jsonMerger';

const { jsonMerger } = defineProps<{
    jsonMerger: JsonMerger;
}>();

const emit = defineEmits<{
    (e: 'submit', data: { isEmpty: boolean; model: any }): void;
}>();

const resultModel = jsonMerger.createInitialModel(jsonMerger.Result);

const submit = () => {
    console.log(resultModel);
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
                <JSDropDown
                    v-if="
                        schemaNode.type === 'number' ||
                        schemaNode.type === 'string' ||
                        schemaNode.type === 'number_or_string'
                    "
                    :type="schemaNode.type"
                    :title="schemaKey"
                    :values="Array.from(schemaNode.values!)"
                    :on-key-stroke="true"
                    @update="(input) => (resultModel[schemaKey] = input)"
                />
                <JSCheckbox
                    v-if="schemaNode.type === 'boolean'"
                    :title="schemaKey"
                    @update="(input) => (resultModel[schemaKey] = input)"
                />
                <JSObjectSelect
                    v-if="schemaNode.type === 'object'"
                    :title="schemaKey"
                    :json-merger="jsonMerger"
                    :parent-node="schemaNode"
                    :parent-result-model="resultModel[schemaKey]"
                />
                <JSMultiSelect
                    v-if="schemaNode.type === 'array'"
                    :title="schemaKey"
                    :schema-node="schemaNode"
                    :json-merger="jsonMerger"
                    @update="(input) => (resultModel[schemaKey] = input)"
                />
            </template>
        </div>
    </div>
</template>

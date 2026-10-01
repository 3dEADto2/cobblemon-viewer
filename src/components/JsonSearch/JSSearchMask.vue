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

let resultModel = undefined as Record<string, any> | undefined;

const submit = () => {
    console.log(resultModel);
    //const cleaned = jsonMerger.removeUnusedFromModel(resultModel);
    //emit('submit', cleaned);
};
</script>

<template>
    <div>
        <div>
            <h1>CardHeader</h1>
            <button @click="submit()">submit</button>
        </div>
        <JSObjectSelect 
            :parent-node="{ type: 'object', properties: jsonMerger.Result } as SchemaNode"
            :json-merger="jsonMerger"
            title="ROOT"
            @update="(input) => resultModel = input"
        />
    </div>
</template>

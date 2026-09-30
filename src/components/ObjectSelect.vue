<script lang="ts" setup>
import SearchDropDown from './SearchDropDown.vue';
import CheckboxInput from './CheckboxInput.vue';
import MultiSelect from './MultiSelect.vue';
import {
    type JsonMergerResult,
    type SchemaNode,
    JsonMerger,
} from './../utils/jsonMerger';
import { unref, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { parentNode, title, jsonMerger, parentResultModel, canBeDestroyed } =
    defineProps<{
        parentNode: SchemaNode;
        parentResultModel: Record<string, any>;
        jsonMerger: JsonMerger;
        title?: string;
        canBeDestroyed?: boolean;
    }>();

const btnCloseHover = ref(false);
const isShown = ref(canBeDestroyed ? true : false);

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'open'): void;
}>();
</script>

<template>
    <div
        class="flex flex-col gap-3 border rounded p-3"
        :class="{
            'border-red-500': btnCloseHover && isShown,
            'border-green-500': btnCloseHover && !isShown,
            'border-secondary': !btnCloseHover,
        }"
    >
        <div class="flex justify-between items-center">
            <h1>{{ title }}</h1>
            <button
                type="button"
                class="cursor-pointer"
                :class="{
                    'text-red-500': isShown && canBeDestroyed,
                    'text-green-500': !isShown,
                }"
                @click="
                    isShown ? emit('close') : emit('open');
                    isShown = !isShown;
                "
                @mouseover="btnCloseHover = true"
                @mouseleave="btnCloseHover = false"
            >
                <FontAwesomeIcon
                    class="text-xl"
                    :icon="
                        !isShown
                            ? 'fa-solid fa-plus'
                            : canBeDestroyed
                              ? 'fa-solid fa-xmark'
                              : 'fa-solid fa-minus'
                    "
                />
            </button>
        </div>
        <div
            v-if="parentNode.properties"
            class="flex flex-col gap-3"
            :class="{ hidden: !isShown }"
        >
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
                    :on-key-stroke="true"
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
                <MultiSelect
                    v-if="schemaNode.type === 'array'"
                    :title="schemaKey"
                    :schema-node="schemaNode"
                    :result-model="parentResultModel[schemaKey]"
                    :json-merger="jsonMerger"
                />
            </template>
        </div>
    </div>
</template>

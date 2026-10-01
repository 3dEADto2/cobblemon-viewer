<script lang="ts" setup>
import JSDropDown from './JSDropDown.vue';
import JSCheckbox from './JSCheckbox.vue';
import JSMultiSelect from './JSMultiSelect.vue';
import {
    type JsonMergerResult,
    type SchemaNode,
    JsonMerger,
} from './../../utils/jsonMerger';
import { unref, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { SearchParameters } from 'src/types.js';

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

// TODO: should also return {} or undefined for consitency
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
                    @update="
                        (input: SearchParameters | undefined) =>
                            (parentResultModel[schemaKey] = input)
                    "
                />
                <JSCheckbox
                    v-if="schemaNode.type === 'boolean'"
                    :title="schemaKey"
                    @update="
                        (input: SearchParameters | undefined) =>
                            (parentResultModel[schemaKey] = input)
                    "
                />
                <JSObjectSelect
                    v-if="schemaNode.type === 'object'"
                    :json-merger="jsonMerger"
                    :parent-node="schemaNode"
                    :parent-result-model="parentResultModel[schemaKey]"
                    :title="schemaKey"
                />
                <JSMultiSelect
                    v-if="schemaNode.type === 'array'"
                    :title="schemaKey"
                    :schema-node="schemaNode"
                    :json-merger="jsonMerger"
                    @update="
                        (input: SearchParameters | undefined) =>
                            (parentResultModel[schemaKey] = input)
                    "
                />
            </template>
        </div>
    </div>
</template>

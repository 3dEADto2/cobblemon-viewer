<script lang="ts" setup>
import SearchDropDown from './SearchDropDown.vue';
import CheckboxInput from './CheckboxInput.vue';
import MultySelect from './MultySelect.vue';
import { JsonMerger, type JsonMergerResult } from './../utils/jsonMerger';
import { InputOptions } from './../types';
import Utils from './../utils/utils';
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const showAll = ref(false);

const { jsonMergerResult, parentKey, depth } = defineProps<{
    jsonMergerResult: JsonMergerResult;
    parentKey?: string;
    depth?: number;
    registerAt: string;
}>();
</script>

<template>
    <div
        :style="{
            'padding-left': `${typeof depth !== 'undefined' ? depth : 0}rem`,
        }"
    >
        <div
            v-if="parentKey"
            class="relative group border-secondary w-fit"
            :class="{
                'rounded-t border-t border-l border-r': showAll,
                'rounded border': !showAll,
            }"
        >
            <div class="flex gap-1 items-center w-fit">
                <h4 class="px-1 text-lg font-semibold underline">
                    {{ Utils.lastStringEntry(parentKey, '/') }}
                </h4>
                <button
                    @click="showAll = !showAll"
                    type="button"
                    class="cursor-pointer"
                >
                    <FontAwesomeIcon
                        class="text-xl"
                        :class="{ hidden: !showAll }"
                        :icon="
                            showAll ? 'fa-solid fa-minus' : 'fa-solid fa-plus'
                        "
                    />
                </button>
            </div>
            <p
                class="absolute -top left mt-1 hidden group-hover:block bg-yellow-100 text-base p-1 rounded w-full text-center z-1"
            >
                {{ parentKey }}
            </p>
        </div>
        <div
            :class="{ hidden: !(!parentKey || showAll) }"
            class="flex flex-col gap-3 border border-secondary rounded-b rounded-tr p-1"
        >
            <template
                v-for="([keyVal, resVal], index) of Object.entries(
                    jsonMergerResult,
                ).sort(([keyA, _a], [keyB, _B]) => (keyA > keyB ? 1 : -1))"
            >
                <SearchDropDown
                    v-if="resVal.type === 'string' || resVal.type === 'number'"
                    :options="{
                        type: resVal.type === 'string' ? 'text' : 'number',
                        registerAt: registerAt,
                    }"
                    :key-val="parentKey ? `${parentKey}/${keyVal}` : keyVal"
                    :values="Array.from(resVal.values ?? [])"
                ></SearchDropDown>
                <MultySelect
                    v-if="resVal.type === 'array'"
                    :key-val="parentKey ? `${parentKey}/${keyVal}` : keyVal"
                    :data="resVal.items!"
                    :register-at="registerAt"
                ></MultySelect>
                <CheckboxInput
                    v-if="resVal.type === 'boolean'"
                    :key-val="parentKey ? `${parentKey}/${keyVal}` : keyVal"
                    :options="{
                        registerAt: registerAt,
                    }"
                ></CheckboxInput>
                <JsonSelection
                    v-if="resVal.type === 'object'"
                    :json-merger-result="jsonMergerResult[keyVal].properties!"
                    :parent-key="parentKey ? `${parentKey}/${keyVal}` : keyVal"
                    :depth="typeof depth !== 'undefined' ? depth + 1 : 1"
                    :register-at="registerAt"
                ></JsonSelection>
            </template>
        </div>
    </div>
</template>

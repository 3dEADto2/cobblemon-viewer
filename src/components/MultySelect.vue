<script lang="ts" setup>
import SearchDropDown from './SearchDropDown.vue';
import { type SchemaNode } from './../utils/jsonMerger.js';
import JsonSelection from './JsonSelection.vue';
import NoFormWrapper from './NoFormWrapper.vue';
import Utils from './../utils/utils';

import { ref, onMounted, inject, onUnmounted, type Ref, computed } from 'vue';
import { type FormContext, type FormFieldData } from './../types';

const registerKey = crypto.randomUUID();

const { data, keyVal, registerAt } = defineProps<{
    data: SchemaNode;
    keyVal?: string;
    registerAt: string;
}>();

const form = inject(registerAt, null) as FormContext | null;
const selected = ref<any[]>([]);

const multiData: FormFieldData = {
    key: keyVal ?? 'unknown',
    value: selected,
    updated: false,
};

const onObjectSubmit = (submitData: Set<FormFieldData>) => {
    console.log(submitData);
    /*
    const result: any = {};

    Array.from(submitData).forEach((el) => {
        result[
            Utils.removeFirstStringEntry(
                el.key,
                '/',
            )
        ] = el.value;
    });

    selected.value.push(result);
    multiData.updated = true;
    */
    const dataArray = Array.from(submitData);
    const result = Utils.normalizeFormFieldData(dataArray);
    selected.value.push(result);
    multiData.updated = true;
    console.log(selected.value);
};

const onDropDownSubmit = (submitData: string | number) => {
    selected.value.push(submitData);
    multiData.updated = true;
};

const selectedDisplay = (val: any) => {
    if (typeof val === 'string' || typeof val === 'number') {
        return val;
    }

    try {
        const jsonText = JSON.stringify(val);
        return jsonText;
    } catch (e) {
        console.error(`MultiSelect json stringify error:`, e);
        return 'JSON ERROR';
    }
};

onMounted(() => {
    if (!form) return;
    form.register(multiData);
});

onUnmounted(() => {
    if (!form) return;
    form.unregister(data);
});
</script>

<template>
    <div class="border border-secondary rounded">
        <h4
            class="border-b border-r border-secondary rounded-br w-fit px-1 text-lg font-semibold"
        >
            {{ keyVal }}
        </h4>
        <div class="flex flex-col gap-1 p-1">
            <div class="flex gap-1">
                <div v-for="(item, index) of selected" class="relative group">
                    <button
                        class="border border-green-500 rounded px-1 cursor-pointer hover:border-red-500 hover:line-through max-w-30 truncate"
                        type="button"
                        @click="selected.splice(index, 1)"
                    >
                        {{ selectedDisplay(item) }}
                    </button>
                    <p
                        class="absolute -top left bg-yellow-100 mt-1 text-base rounded px-1 hidden group-hover:block z-1"
                    >
                        {{ selectedDisplay(item) }}
                    </p>
                </div>
            </div>
            <NoFormWrapper
                v-if="data.type === 'object'"
                :register-key="registerKey"
                :submitBtnName="`(${Utils.lastStringEntry(keyVal ?? 'unknown', '/')}) multi-submit`"
                @submit="onObjectSubmit"
            >
                <JsonSelection
                    :json-merger-result="data.properties!"
                    :parent-key="
                        Utils.removeFirstStringEntry(keyVal ?? '', '/')
                    "
                    :register-at="registerKey"
                />
            </NoFormWrapper>
            <SearchDropDown
                v-if="
                    data.type === 'string' ||
                    data.type === 'number' ||
                    data.type === 'number_or_string'
                "
                :options="{
                    type:
                        data.type === 'string' ||
                        data.type === 'number_or_string'
                            ? 'text'
                            : 'number',
                }"
                :values="Array.from(data.values ?? [])"
                @update="onDropDownSubmit"
            />
        </div>
    </div>
</template>

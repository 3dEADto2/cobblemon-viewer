<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    type InputOptions,
    type FormContext,
    type FormFieldData,
} from './../types';

import { ref, onMounted, inject, onUnmounted, type Ref, computed } from 'vue';

const { options, keyVal, values, initValue } = defineProps<{
    options: InputOptions;
    keyVal?: string;
    values?: (string | number)[];
    initValue?: string | number;
}>();

const form = inject(options?.registerAt ?? '', null) as FormContext | null;

const showDropDown = ref(false);

const inputVal = ref<string | number>(
    options.type === 'text'
        ? initValue
            ? initValue
            : ''
        : initValue
          ? initValue
          : 0,
);

const data: FormFieldData = {
    key: keyVal ?? 'unknown',
    value: inputVal,
    updated: false,
};

const sortedValues = computed(() => {
    if (options.type === 'text') {
        const toSearch = new RegExp(`^.*${inputVal.value}.*$`, 'im');
        return (values ?? []).filter(
            (el) => typeof el === 'string' && toSearch.test(el),
        );
    }

    return values ?? [];
});

const emit = defineEmits<{
    (e: 'update', data: string | number): void;
}>();

const checkBtnHandler = () => {
    if (!inputVal.value) return;

    emit('update', inputVal.value);
    inputVal.value = options.type === 'text' ? '' : 0;
};

onMounted(() => {
    if (!form) return;
    form.register(data);
});

onUnmounted(() => {
    if (!form) return;
    form.unregister(data);
});
</script>

<template>
    <div class="flex flex-col border border-secondary rounded py-1 gap-1">
        <div class="flex gap-2 px-1">
            <h4 v-if="keyVal" class="font-semibold">{{ keyVal }}:</h4>
            <input
                :type="options.type === 'text' ? 'text' : 'number'"
                step="any"
                v-model="inputVal"
                @input="data.updated = true"
                class="grow outline-none bg-main/10"
            />
            <div class="flex gap-1">
                <button
                    v-if="!form"
                    type="button"
                    class="size-fit cursor-pointer active:text-green-700"
                    @click="checkBtnHandler()"
                >
                    <FontAwesomeIcon class="text-xl" icon="fa-solid fa-check" />
                </button>
                <div
                    class="relative flex justify-center items-center size-fit cursor-pointer"
                >
                    <FontAwesomeIcon
                        class="text-xl"
                        :class="{ hidden: !showDropDown }"
                        :icon="
                            showDropDown
                                ? 'fa-solid fa-minus'
                                : 'fa-solid fa-plus'
                        "
                    />
                    <input
                        class="absolute opacity-0 size-full cursor-pointer"
                        type="checkbox"
                        :disabled="!values"
                        @change="showDropDown = !showDropDown"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="showDropDown && values"
            class="flex flex-col h-36 overflow-y-auto border-t border-secondary px-1 scrollbar-none"
        >
            <button
                type="button"
                v-for="(value, index) of sortedValues"
                @click="
                    inputVal = value;
                    showDropDown = false;
                    data.updated = true;
                "
                class="hover:underline cursor-pointer"
                :class="{ 'bg-white/5': index % 2 }"
            >
                {{ value }}
            </button>
        </div>
    </div>
</template>

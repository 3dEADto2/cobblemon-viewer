<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, computed } from 'vue';

export interface SearchDropDownOptions {
    onKeyStroke?: boolean;
    inputDisabled?: boolean;
    dropDownDisabled?: boolean;
}

const defaultOptions: SearchDropDownOptions = {
    onKeyStroke: true,
    inputDisabled: false,
    dropDownDisabled: false,
};

const { title, values, options: incomingOptions } = defineProps<{
    title?: string;
    values?: any[];
    options?: SearchDropDownOptions;
}>();

const options = { ...defaultOptions, ...incomingOptions };

const showDropDown = ref(false);

const inputVal = ref<string | number>();

const sortedValues = computed(() => {
    if (typeof inputVal.value === 'string' && !options.inputDisabled) {
        const toSearch = new RegExp(`^.*${inputVal.value}.*$`, 'im');
        return (values ?? []).filter(
            (el) => typeof el === 'string' && toSearch.test(el),
        );
    }

    return values ?? [];
});

const emit = defineEmits<{
    (e: 'update', data: string | number | undefined): void;
}>();

const checkBtnHandler = () => {
    if (!inputVal.value) return;

    emit('update', inputVal.value);
    inputVal.value = typeof inputVal.value === 'number' ? 0 : '';
};

const inputHandler = () => {
    if (!options.onKeyStroke) return;
    if (inputVal.value === '') {
        inputVal.value = undefined;
    }

    emit('update', inputVal.value);
};
</script>

<template>
    <div
        class="flex flex-col border rounded py-1 gap-1 h-fit"
        :class="{
            'border-secondary':
                !options.onKeyStroke || inputVal === undefined || inputVal === '',
            'border-green-500':
                options.onKeyStroke && inputVal !== undefined && inputVal !== '',
        }"
    >
        <div class="flex gap-2 px-1">
            <h4 v-if="title" class="font-semibold">{{ title }}:</h4>
            <input
                :type="typeof inputVal === 'number' ? 'number' : 'text'"
                :disabled="options.inputDisabled"
                step="any"
                v-model="inputVal"
                @input="inputHandler()"
                class="grow outline-none bg-main/10 px-1"
                :class="{ 'cursor-not-allowed': options.inputDisabled }"
            />
            <div class="flex gap-1">
                <button
                    v-if="!options.onKeyStroke"
                    type="button"
                    class="size-fit cursor-pointer active:text-green-700"
                    @click="checkBtnHandler()"
                >
                    <FontAwesomeIcon class="text-xl" icon="fa-solid fa-check" />
                </button>
                <div
                    v-if="!options.dropDownDisabled && values?.length"
                    class="relative flex justify-center items-center size-fit cursor-pointer"
                >
                    <FontAwesomeIcon
                        class="text-xl"
                        :class="{ hidden: !showDropDown }"
                        :icon="
                            showDropDown
                                ? 'fa-solid fa-chevron-up'
                                : 'fa-solid fa-chevron-down'
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
            v-if="showDropDown && values?.length"
            class="flex flex-col max-h-36 overflow-y-auto border-t border-secondary px-1 scrollbar-none"
        >
            <button type="button" class="bg-red-500 text-base opacity-50 font-semibold hover:underline cursor-pointer" @click="inputVal = undefined; showDropDown = false; emit('update', inputVal)">SET UNDEFINED</button>
            <button
                type="button"
                v-for="(value, index) of sortedValues"
                @click="
                    inputVal = value;
                    showDropDown = false;
                    emit('update', inputVal);
                "
                class="hover:underline cursor-pointer"
                :class="{
                    'bg-white/10': index % 2,
                    'bg-white/20': !(index % 2),
                }"
            >
                {{ value }}
            </button>
        </div>
    </div>
</template>

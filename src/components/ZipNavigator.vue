<script lang="ts" setup>
import ZipManager from './../utils/zipManager';
import { ref, onMounted, type Ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const fileInput = ref<HTMLInputElement | null>(null);

const zipManagerInit = ref(false);
let zipManager = new ZipManager(new File([], ''));

const shownParts = ref<Record<string, 'file' | 'folder'>>({});
const currentFolderPath = ref<string[]>([]);

const emit = defineEmits<{
    (e: 'fileSelect', files: Record<string, any>[]): void;
    (e: 'folderSelect', data: { path: string; zipManager: ZipManager }): void;
}>();

const fileBtnHandler = async (fileName: string) => {
    const files = await zipManager.getJsonObjects([
        `${currentFolderPath.value.join('/')}/${fileName}`,
    ]);

    emit('fileSelect', files);
};

const folderBtnHandler = (folderName: string) => {
    currentFolderPath.value.push(folderName);
    const path = currentFolderPath.value.join('/');

    shownParts.value = zipManager.getNames('all', path);

    emit('folderSelect', { path, zipManager });
};

const breadCrumpHandler = (index: number) => {
    if (index < 0) {
        currentFolderPath.value = [];
    } else {
        currentFolderPath.value = currentFolderPath.value.slice(0, index + 1);
    }

    shownParts.value = zipManager.getNames(
        'all',
        currentFolderPath.value.join('/'),
    );
};

onMounted(() => {
    if (!fileInput.value) return;
    fileInput.value.addEventListener('change', async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target?.files?.[0];
        if (!file) return;

        zipManager = new ZipManager(file);

        zipManagerInit.value = await zipManager.init();

        if (zipManagerInit.value) {
            shownParts.value = zipManager.getNames();
        }
    });
});
</script>

<template>
    <div class="flex flex-col gap-1 border border-secondary rounded p-1">
        <div
            class="relative flex justify-center items-center bg-secondary text-base w-full p-1"
        >
            <FontAwesomeIcon
                v-if="!zipManager.fileName"
                class="text-6xl"
                icon="fa-solid fa-file-arrow-up"
            />
            <h3 v-if="zipManager.fileName">{{ zipManager.fileName }}</h3>
            <input
                ref="fileInput"
                type="file"
                accept=".jar,.zip"
                class="absolute top-0 left-0 size-full cursor-pointer opacity-0"
            />
        </div>
        <template v-if="zipManagerInit">
            <div class="flex gap-1 flex-wrap">
                <button
                    type="button"
                    @click="breadCrumpHandler(-1)"
                    class="hover:underline cursor-pointer bg-secondary text-base rounded px-1"
                >
                    root/
                </button>
                <button
                    v-for="(path, index) of currentFolderPath"
                    @click="breadCrumpHandler(index)"
                    type="button"
                    class="hover:underline cursor-pointer bg-secondary text-base rounded px-1"
                >
                    {{ path }}/
                </button>
            </div>
            <div class="flex flex-col gap-1 max-h-40 overflow-y-auto">
                <template v-for="(type, key, index) in shownParts">
                    <button
                        v-if="type === 'file'"
                        @click="fileBtnHandler(key)"
                        class="hover:underline cursor-pointer"
                        :class="{
                            'bg-white/10': index % 2,
                            'bg-white/20': !(index % 2),
                        }"
                    >
                        {{ key }}
                    </button>
                    <button
                        v-if="type === 'folder'"
                        @click="folderBtnHandler(key)"
                        class="hover:underline cursor-pointer"
                        :class="{
                            'bg-white/10': index % 2,
                            'bg-white/20': !(index % 2),
                        }"
                    >
                        {{ key }}
                    </button>
                </template>
            </div>
        </template>
    </div>
</template>

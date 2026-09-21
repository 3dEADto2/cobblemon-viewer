<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import JSZip from 'jszip';
import { JsonMerger, type JsonMergerResult } from './../utils/jsonMerger';
import FormWrapper from './../components/FormWrapper.vue';
import JsonSelecetion from './../components/JsonSelection.vue';

interface FolderNode {
    path: string;
    subfolders: Record<string, FolderNode>;
}

type FolderTree = Record<string, FolderNode>;

const registerKey = crypto.randomUUID();

const getFolderName = (path: string) => {
    const index = path.lastIndexOf('/');
    if (index < 0) return path;

    return path.slice(index + 1);
};

const jsonMerger = new JsonMerger();
let zip = new JSZip();

const jsonMergerResult = ref<JsonMergerResult>({});
const fileInput = ref<HTMLInputElement | null>(null);

const addToTree = (segments: string[], root: FolderTree = {}) => {
    let currentLevel = root;
    let currentPath = '';

    for (const segment of segments) {
        if (!segment) continue;

        currentPath = currentPath ? `${currentPath}/${segment}` : segment;

        if (!currentLevel[segment]) {
            currentLevel[segment] = {
                path: currentPath,
                subfolders: {},
            };
        }

        currentLevel = currentLevel[segment].subfolders;
    }

    return root;
};

const folderTree: FolderTree = {};
const selectFolderTree = ref<FolderNode[]>([]);
const selectFolderTreePath = ref<FolderNode[]>([]);
const selectFolderTreePathStr = computed(() => {
    const len = selectFolderTreePath.value.length;
    if (!len) return '';

    return selectFolderTreePath.value[len - 1].path;
});
const selectFiles = ref<string[]>([]);

const selectFolder = (folderNode: FolderNode, index?: number) => {
    selectFolderTree.value = Object.values(folderNode.subfolders);
    selectFiles.value = [];

    if (index === undefined) {
        selectFolderTreePath.value.push(folderNode);
    } else {
        selectFolderTreePath.value = selectFolderTreePath.value.filter(
            (_, i) => i <= index,
        );
    }

    if (Object.keys(folderNode.subfolders).length) return;

    zip.folder(folderNode.path)?.forEach((fileName, entry) => {
        selectFiles.value.push(`${folderNode.path}/${fileName}`);
    });
};

const selectRoot = () => {
    selectFolderTreePath.value = [];
    selectFolderTree.value = Object.values(folderTree);
};

const copyCurrentPath = () => {
    navigator.clipboard.writeText(
        selectFolderTreePath.value[selectFolderTreePath.value.length - 1].path,
    );
};

// TODO rework to work with every file, not just json
const selectFile = async (path: string) => {
    const fileEntry = zip.file(path);
    if (!fileEntry) return;

    try {
        const jsonText = await fileEntry.async('text');
        const json = JSON.parse(jsonText);
        console.log(json);
    } catch (error) {
        console.error(`No json file: ${path}`, error);
    }
};

const getAllPaths = (lookIn?: string) => {
    const paths: {
        type: 'dir' | 'file';
        path: string;
    }[] = [];

    const folder = lookIn ? zip.folder(lookIn) : zip;
    if (!folder) return paths;

    folder.forEach((filePath, entry) => {
        paths.push({
            type: entry.dir ? 'dir' : 'file',
            path: lookIn ? lookIn + '/' + filePath : filePath,
        });
    });

    return paths;
};

const getAllJsonPaths = (lookIn?: string) => {
    const pathsData = getAllPaths(lookIn);
    const jsonPaths: string[] = [];
    pathsData.forEach((pathData) => {
        if (pathData.type === 'dir') return;
        if (pathData.path.slice(-5) !== '.json') return;

        jsonPaths.push(pathData.path);
    });

    return jsonPaths;
};

const getAllJson = async (paths: string[]) => {
    const result: any[] = [];

    for (const path of paths) {
        const fileEntry = zip.file(path);
        if (!fileEntry) {
            console.info(`No json file at ${path}`);
            continue;
        }

        try {
            const jsonText = await fileEntry.async('text');
            const json = JSON.parse(jsonText);
            result.push(json);
        } catch (e) {
            console.error(`Could not get json for ${path}`, e);
        }
    }

    return result;
};

const onBlueprintCreateSubmit = async (folderPath: string) => {
    const jsonPaths = getAllJsonPaths(folderPath);
    const jsons = await getAllJson(jsonPaths);
    jsonMerger.addJsons(jsons);

    console.log(jsonMerger.Result);
    const initObject = jsonMerger.createInitialModel(jsonMerger.Result);
    console.log(initObject);
};

onMounted(() => {
    if (!fileInput.value) return;
    fileInput.value.addEventListener('change', async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target?.files?.[0];
        if (!file) return;

        zip = await JSZip.loadAsync(file);

        zip.forEach((relativePath, entry) => {
            if (!entry.dir) return;

            const folders = relativePath.split('/');

            addToTree(folders, folderTree);
        });

        selectFolderTree.value = Object.values(folderTree);
    });
});
</script>

<template>
    <input ref="fileInput" type="file" accept=".jar,.zip" />
    <ul class="flex gap-1">
        <li v-if="selectFolderTreePath.length">
            <button
                @click="selectRoot()"
                class="cursor-pointer hover:underline"
            >
                root/
            </button>
        </li>
        <li v-for="(folder, index) of selectFolderTreePath" :key="folder.path">
            <button
                @click="selectFolder(folder, index)"
                class="cursor-pointer hover:underline"
            >
                {{ getFolderName(folder.path) + '/' }}
            </button>
        </li>
        <li v-if="selectFolderTreePath.length">
            <button
                @click="copyCurrentPath()"
                class="cursor-pointer hover:underline"
            >
                [COPY]
            </button>
        </li>
    </ul>
    <ul
        v-if="selectFolderTree.length"
        class="h-50 min-w-50 max-w-fit p-1 border overflow-y-auto"
    >
        <li v-for="folder of selectFolderTree" :key="folder.path">
            <button
                @click="selectFolder(folder)"
                class="cursor-pointer hover:underline"
            >
                {{ getFolderName(folder.path) }}
            </button>
        </li>
    </ul>
    <ul
        v-if="selectFiles.length"
        class="h-50 min-w-50 max-w-fit p-1 border overflow-y-auto"
    >
        <li v-for="path of selectFiles" :key="path">
            <button
                @click="selectFile(path)"
                class="cursor-pointer hover:underline"
            >
                {{ getFolderName(path) }}
            </button>
        </li>
    </ul>
    <div>
        <form
            @submit.prevent="onBlueprintCreateSubmit(selectFolderTreePathStr)"
        >
            <input :value="selectFolderTreePathStr" disabled />
            <button type="submit">SELECT FOLDER</button>
        </form>
        <h1>DUMMY</h1>
    </div>
</template>

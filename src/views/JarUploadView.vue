<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { JsonMerger, type JsonMergerResult } from './../utils/jsonMerger';
import { JsonHandler } from './../utils/jsonHandler';
import JsonSearchMask from './../components/JsonSearchMask.vue';
import JSSearchMask from './../components/JsonSearch/JSSearchMask.vue';
import ZipNavigator from './../components/ZipNavigator.vue';
import ZipManager from './../utils/zipManager';

let toBuildFolderSchema: { path: string; zipManager: ZipManager } | null = null;
const jsonHandler = ref<JsonHandler | null>();

/*
const onBlueprintCreateSubmit = async (folderPath: string) => {
    const jsonPaths = getAllJsonPaths(folderPath);
    const jsons = await getAllJson(jsonPaths);
    const jsonMerger = new JsonMerger();
    jsonMerger.addJsons(jsons);

    jsonSearchMaskMerger.value = jsonMerger;
};
*/

const zipFolderSelectHandler = (event: {
    path: string;
    zipManager: ZipManager;
}) => {
    toBuildFolderSchema = event;
};

const buildJsonSchema = async () => {
    if (!toBuildFolderSchema) return;

    const { path, zipManager } = toBuildFolderSchema;
    const tempPath = 'data/cobblemon/species';

    const filePaths = zipManager.getAllFilePaths(tempPath);
    const jsonObjects = await zipManager.getJsonObjects(filePaths);

    jsonHandler.value = new JsonHandler(jsonObjects);
};

const onFilterSubmit = (data: { isEmpty: boolean; model: any }) => {
    console.log(data);
};

onMounted(() => {});
</script>

<template>
    <ZipNavigator @folder-select="zipFolderSelectHandler" />
    <button type="button" @click="buildJsonSchema()">BuildJsonSchema</button>
    <JSSearchMask
        v-if="jsonHandler"
        :json-merger="jsonHandler.getJsonMerger()"
        @submit="onFilterSubmit"
    />
</template>

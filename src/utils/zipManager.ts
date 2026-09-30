import JSZip from 'jszip';

export default class ZipManager {
    public isInitiated = false;
    private zip = new JSZip();

    constructor(private file: File) {}

    public async init() {
        try {
            this.zip = await JSZip.loadAsync(this.file);

            if (Object.keys(this.zip.files).length > 0) {
                this.isInitiated = true;
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error while loading the zip:', error);
            return false;
        }
    }

    public getNames(types: 'all' | 'file' | 'folder' = 'all', path = '') {
        const toSearch = path ? this.zip.folder(path) : this.zip;
        const result: Record<string, 'folder' | 'file'> = {};

        toSearch?.forEach((relativePath, entry) => {
            const paths = relativePath.split('/');
            if (!paths.length) return;

            const name = paths[0];
            if (!name) return;

            const isFolder = paths.length > 1 || entry.dir;

            if (types === 'all') {
                result[name] = isFolder ? 'folder' : 'file';
            } else if (types === 'file' && !isFolder) {
                result[name] = 'file';
            } else if (types === 'folder' && isFolder) {
                result[name] = 'folder';
            }
        });

        return result;
    }

    public async getFiles(paths: string[]) {
        const result: string[] = [];

        for (const path of paths) {
            const fileEntry = this.zip.file(path);

            if (!fileEntry || fileEntry.dir) continue;

            try {
                const text = await fileEntry.async('text');
                result.push(text);
            } catch (e) {
                console.info(`Could file not convert to text: ${path}`);
            }
        }

        return result;
    }

    public async getJsonObjects(paths: string[]) {
        const texts = await this.getFiles(paths);
        const result: Record<string, any>[] = [];

        for (const text of texts) {
            try {
                const jsonObject = JSON.parse(text);
                result.push(jsonObject);
            } catch (e) {
                console.info(`Could not convert text to jsonObject: ${text}`);
            }
        }

        return result;
    }

    public getAllFilePaths(folderPath: string) {
        const folder = this.zip.folder(folderPath);
        const filePaths: string[] = [];

        folder?.forEach((relativePath, entry) => {
            if (entry.dir) return;
            filePaths.push(folderPath + '/' + relativePath);
        });

        return filePaths;
    }

    public get fileName() {
        return this.file.name;
    }
}

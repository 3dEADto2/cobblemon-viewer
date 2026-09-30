import { JsonMerger } from './jsonMerger';

export class JsonHandler {
    private jsonMerger = new JsonMerger();

    constructor(private defaultData: Record<string, any>[]) {
        this.jsonMerger.addJsons(this.defaultData);
    }

    public getJsonMerger() {
        return this.jsonMerger;
    }
}

// 1. Wir definieren saubere Typen für unser Ergebnis-Schema
export type SchemaType =
    | 'string'
    | 'number'
    | 'number_or_string'
    | 'boolean'
    | 'object'
    | 'array'
    | 'unknown';

export interface SchemaNode {
    type: SchemaType;
    values?: Set<any>; // Für primitive Werte (Strings, Numbers)
    properties?: Record<string, SchemaNode>; // Wenn type === 'object'
    items?: SchemaNode; // Wenn type === 'array' (Das Schema der Array-Elemente)
}

export type JsonMergerResult = Record<string, SchemaNode>;

export class JsonMerger {
    private result: JsonMergerResult = {};

    public get Result() {
        return this.result;
    }

    public reset() {
        this.result = {};
    }

    public addJsons(jsons: unknown[]) {
        jsons.forEach((json) => this.addJson(json));
    }

    public addJson(json: unknown) {
        if (!json || typeof json !== 'object' || Array.isArray(json)) return;
        this.manageObject(json as Record<string, unknown>, this.result);
    }

    private manageObject(
        json: Record<string, unknown>,
        resultNode: Record<string, SchemaNode>,
    ) {
        Object.entries(json).forEach(([key, value]) => {
            // Null-Werte ignorieren oder separat behandeln
            if (value === null) return;

            // --- STRINGS & NUMBERS ---
            if (typeof value === 'string' || typeof value === 'number') {
                const isString = typeof value === 'string';

                if (!resultNode[key]) {
                    resultNode[key] = {
                        type: isString ? 'string' : 'number',
                        values: new Set(),
                    };
                }

                const currentNode = resultNode[key];

                // Typ-Upgrade, falls wir gemischte Typen finden (z.B. ID ist mal '123', mal 123)
                if (currentNode.type === 'string' && !isString) {
                    currentNode.type = 'number_or_string';
                } else if (currentNode.type === 'number' && isString) {
                    currentNode.type = 'number_or_string';
                }

                // Wert zum Set hinzufügen
                if (currentNode.values) {
                    currentNode.values.add(value);
                }
            }

            // --- BOOLEANS ---
            else if (typeof value === 'boolean') {
                if (!resultNode[key]) {
                    resultNode[key] = { type: 'boolean' };
                }
            }

            // --- ARRAYS ---
            else if (Array.isArray(value)) {
                if (!resultNode[key]) {
                    // Wir initialisieren items mit 'unknown', bis wir Elemente finden
                    resultNode[key] = {
                        type: 'array',
                        items: { type: 'unknown' },
                    };
                }
                this.manageArray(value, resultNode[key]);
            }

            // --- OBJECTS ---
            else if (typeof value === 'object') {
                if (!resultNode[key]) {
                    resultNode[key] = { type: 'object', properties: {} };
                }

                // Rekursiver Aufruf: Das Objekt in die properties mergen
                if (resultNode[key].properties) {
                    this.manageObject(
                        value as Record<string, unknown>,
                        resultNode[key].properties!,
                    );
                }
            }
        });

        return resultNode;
    }

    private manageArray(arr: unknown[], arrayNode: SchemaNode) {
        if (!arr.length) return;

        // Wir iterieren über ALLE Elemente, nicht nur über arr[0],
        // um das korrekte "items"-Schema aufzubauen
        arr.forEach((item) => {
            if (item === null) return;

            // Wenn das Items-Schema noch unbekannt ist, setzen wir den Basis-Typ des aktuellen Items
            if (arrayNode.items!.type === 'unknown') {
                if (typeof item === 'string')
                    arrayNode.items = { type: 'string', values: new Set() };
                else if (typeof item === 'number')
                    arrayNode.items = { type: 'number', values: new Set() };
                else if (typeof item === 'boolean')
                    arrayNode.items = { type: 'boolean' };
                else if (Array.isArray(item))
                    arrayNode.items = {
                        type: 'array',
                        items: { type: 'unknown' },
                    };
                else if (typeof item === 'object')
                    arrayNode.items = { type: 'object', properties: {} };
            }

            // Werte sammeln & in das gemergte Schema eintragen
            const itemSchema = arrayNode.items!;

            if (typeof item === 'string' || typeof item === 'number') {
                // Gemischte Arrays (String + Number) behandeln
                const isString = typeof item === 'string';
                if (itemSchema.type === 'string' && !isString)
                    itemSchema.type = 'number_or_string';
                if (itemSchema.type === 'number' && isString)
                    itemSchema.type = 'number_or_string';

                if (!itemSchema.values) itemSchema.values = new Set();
                itemSchema.values.add(item);
            } else if (Array.isArray(item)) {
                this.manageArray(item, itemSchema);
            } else if (typeof item === 'object') {
                if (!itemSchema.properties) itemSchema.properties = {};
                // MERGE das Objekt in die properties des Array-Schemas
                this.manageObject(
                    item as Record<string, unknown>,
                    itemSchema.properties,
                );
            }
        });
    }

    public createInitialModel(schema: JsonMergerResult) {
        const initModel: Record<string, any> = {};

        for (const [key, node] of Object.entries(schema)) {
            initModel[key] = this.createModelBySchemaNode(node);
        }

        return initModel;
    }

    public createModelBySchemaNode(schemaNode: SchemaNode) {
        if (!schemaNode) return undefined;

        const { type, properties } = schemaNode;

        if (type === 'object') {
            const initModel: Record<string, any> = {};

            if (properties) {
                for (const [key, node] of Object.entries(properties)) {
                    initModel[key] = this.createModelBySchemaNode(node);
                }
            }

            return initModel;
        }

        if (type === 'array') {
            return [];
        }

        return undefined;
    }
}

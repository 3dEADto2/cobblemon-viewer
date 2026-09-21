import { type FormFieldData } from './../types';
import { unref } from 'vue';

export default class Utils {
    public static lastStringEntry(str: string, seperator: string) {
        const splitStr = str.split(seperator);
        return splitStr[splitStr.length - 1];
    }

    public static removeFirstStringEntry(str: string, seperator: string) {
        const splitStr = str.split('/');
        if (splitStr.length < 2) return str;
        splitStr.shift();

        const result = splitStr.join('/');
        return result ? result : str;
    }

    public static normalizeFormFieldData(
        formFieldData: FormFieldData[],
        convertFormFieldData = true,
        checkUpdate = true,
    ) {
        console.log(formFieldData);
        return formFieldData;
    }
}

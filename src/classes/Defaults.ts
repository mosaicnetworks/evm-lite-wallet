import * as path from 'path';

export default class Defaults {
    // @ts-ignore
    public static dataDirectory = path.join(window.require('os').homedir(), '.evmlc');
}
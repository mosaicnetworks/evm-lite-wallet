import * as path from 'path';

export default class Defaults {
	public static dataDirectory = path.join(
		// @ts-ignore
		window.require('os').homedir(),
		'.evmlc'
	);
}

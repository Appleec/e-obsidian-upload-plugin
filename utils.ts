import { resolve, extname, relative, join, parse, posix } from "path";
const IMAGE_EXT_LIST = [
	".png",
	".jpg",
	".jpeg",
	".bmp",
	".gif",
	".svg",
	".tiff",
	".webp",
	".avif",
];

export function isAnImage(ext: string) {
	return IMAGE_EXT_LIST.includes(ext.toLowerCase());
}

export function isAssetTypeAnImage(path: string): Boolean {
	return isAnImage(extname(path));
}

export function bufferToArrayBuffer(buffer: Buffer) {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; i++) {
		view[i] = buffer[i];
	}
	return arrayBuffer;
}

import { resolve, extname, relative, join, parse, posix, basename} from "path";
import { format } from 'date-fns';
import { isArray, isFunction, isString, template } from 'lodash-es';
import { SafeAny, IMedia } from "../type";

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

/**
 * File to ArrayBuffer
 * @param file
 */
export async function fileToArrayBuffer(file: File) {
	return new Promise<any>((resolve, reject) => {
		const fr = new FileReader();
		let buf: any;

		fr.readAsArrayBuffer(file);

		fr.onload = () => {
			buf = fr.result;
		}

		fr.onerror = (error) => {
			reject(error);
		}

		fr.onloadend = () => {
			// resolve([buf, file && file.name]);
			resolve(buf);
		}

		// fr.addEventListener("loadend",(e: any) => {
		// 	const buf = e.target.result;
		// 	resolve(buf);
		// },false);
		// fr.addEventListener("error", (e: any) => {
		// 	reject(e);
		// })
	})
}

/**
 * File to Base64
 * @param file
 */
export async function fileToBase64(file: File): Promise<string> {
	return await new Promise((resolve, reject) => {
		const reader = new FileReader()
		let fileResult: string
		reader.readAsDataURL(file)
		reader.onload = () => {
			fileResult = reader.result as string
			fileResult = fileResult.slice(fileResult.indexOf(',') + 1)
		}
		reader.onerror = (error) => {
			reject(error)
		}
		reader.onloadend = () => {
			resolve(fileResult)
		}
	})
}

/**
 * buffer 转 ArrayBuffer
 * @param buffer
 */
export function bufferToArrayBuffer(buffer: Buffer) {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; i++) {
		view[i] = buffer[i];
	}
	return arrayBuffer;
}

/**
 * 生成 boundary
 */
export function getBoundary(): string {
	return `----obsidianBoundary${format(new Date(), 'yyyyMMddHHmmss')}`;
}

/**
 * 检验图片是否合法
 * @param ext
 */
export function isAnImage(ext: string) {
	return IMAGE_EXT_LIST.includes(ext.toLowerCase());
}

/**
 * 检验图片路径是否合法
 * @param path
 */
export function isAssetTypeAnImage(path: string): Boolean {
	return isAnImage(extname(path));
}


type UrlGetter = () => string;

/**
 * 获取 URL
 * @param url
 * @param defaultValue
 * @param params
 */
export function getUrl(
	url: string | UrlGetter | undefined,
	defaultValue: string,
	params?: { [p: string]: string | number }
): string {
	let resultUrl: string;
	if (isString(url)) {
		resultUrl = url;
	} else if (isFunction(url)) {
		resultUrl = url();
	} else {
		resultUrl = defaultValue;
	}
	if (params) {
		const compiled = template(resultUrl);
		return compiled(params);
	} else {
		return resultUrl;
	}
}

/**
 * 检测是否是合法的Media
 * @param obj
 */
export function isMedia(obj: any): obj is IMedia {
	return (
		typeof obj === 'object'
		&& obj !== null
		&& 'mimeType' in obj && typeof obj.mimeType === 'string'
		&& 'fileName' in obj && typeof obj.fileName === 'string'
		&& 'content' in obj && obj.content instanceof ArrayBuffer
	);
}

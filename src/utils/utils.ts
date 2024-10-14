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
 * File 转 ArrayBuffer
 * @param file
 */
export async function fileToArrayBuffer(file: File) {
	return new Promise<any>((resolve, reject) => {
		const fr = new FileReader();
		const filename = file.name;

		fr.readAsArrayBuffer(file);
		fr.addEventListener("loadend",(e: any) => {
			const buf = e.target.result;
			resolve([buf, filename]);
		},false);
		fr.addEventListener("error", (e: any) => {
			reject(e);
		})
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

export interface Media {
	mimeType: string;
	fileName: string;
	content: ArrayBuffer;
}

/**
 * Convert original item name to custom one.
 *
 * @param name original item name. If `isArray` is `true`, which means is in an array, the `name` will be appended by `[]`
 * @param isArray whether this item is in an array
 */
export type FormItemNameMapper = (name: string, isArray: boolean) => string;

export class FormItems {
	#formData: Record<string, SafeAny> = {};

	append(name: string, data: string): FormItems;
	append(name: string, data: IMedia): FormItems;
	append(name: string, data: string | IMedia): FormItems {
		const existing = this.#formData[name];
		if (existing) {
			this.#formData[name] = [ existing ];
			this.#formData[name].push(data);
		} else {
			this.#formData[name] = data;
		}
		return this;
	}

	toArrayBuffer(option: {
		boundary: string;
		nameMapper?: FormItemNameMapper;
	}): Promise<ArrayBuffer> {
		const CRLF = '\r\n';
		const itemPart = (name: string, data: string | IMedia, isArray: boolean) => {
			let itemName = name;
			if (option.nameMapper) {
				itemName = option.nameMapper(name, isArray);
			}

			body.push(encodedItemStart);
			if (isString(data)) {
				body.push(encoder.encode(`Content-Disposition: form-data; name="${itemName}"${CRLF}${CRLF}`));
				body.push(encoder.encode(data));
			} else {
				const media = data;
				body.push(encoder.encode(`Content-Disposition: form-data; name="${itemName}"; filename="${media.fileName}"${CRLF}Content-Type: ${media.mimeType}${CRLF}${CRLF}`));
				body.push(media.content);
			}
			body.push(encoder.encode(CRLF));
		};

		const encoder = new TextEncoder();
		const encodedItemStart = encoder.encode(`--${option.boundary}${CRLF}`);
		const body: ArrayBuffer[] = [];
		Object.entries(this.#formData).forEach(([ name, data ]) => {
			if (isArray(data)) {
				data.forEach(item => {
					itemPart(`${name}[]`, item, true);
				});
			} else {
				itemPart(name, data, false);
			}
		});
		body.push(encoder.encode(`--${option.boundary}--`));
		return new Blob(body).arrayBuffer();
	}
}

export function formItemNameMapper(name: string, isArray: boolean): string {
	if (name === 'file' && !isArray) {
		return 'media[]';
	}
	return name;
}

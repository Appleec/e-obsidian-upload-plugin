// Imports
import { isArray, isString } from 'lodash-es';
import fileTypeChecker from "file-type-checker";

// Utils
import { fileToArrayBuffer } from './utils';

class FormDataFormat {
	#formData: Record<string, any> = {};

	append(name: string, data: string): FormDataFormat;
	append(name: string, data: File): FormDataFormat;
	append(name: string, data: string | File): FormDataFormat {
		const existing = this.#formData[name];
		if (existing) {
			this.#formData[name] = [ existing ];
			this.#formData[name].push(data);
		} else {
			this.#formData[name] = data;
		}
		return this;
	}

	get(name: string): any {
		return this.#formData[name];
	}

	async toArrayBuffer(option: {
		boundary: string;
	}): Promise<ArrayBuffer> {
		const CRLF = '\r\n';
		const encoder = new TextEncoder();
		const encodedItemStart = encoder.encode(`--${option.boundary}${CRLF}`);
		const body: ArrayBuffer[] = [];

		const itemPart1 = async (name: string, data: string | File) => {
			return new Promise(async (resolve, reject) => {
				body.push(encodedItemStart);

				if (isString(data)) {
					body.push(encoder.encode(`Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}`));
					body.push(encoder.encode(data));
					body.push(encoder.encode(CRLF));
					resolve(void 0)
				} else {
					const fileBuffer = await fileToArrayBuffer(data);
					const fileName = data.name;
					const mimeType = data.type ||
						fileTypeChecker.detectFile(fileBuffer)?.mimeType ||
						'application/octet-stream';
					body.push(encoder.encode(`Content-Disposition: form-data; name="${name}"; filename="${fileName}"${CRLF}Content-Type: ${mimeType}${CRLF}${CRLF}`));
					body.push(fileBuffer);
					body.push(encoder.encode(CRLF));
					resolve(void 0)
				}
			})
		}

		const o = Object.entries(this.#formData);
		for (let i = 0; i < o.length; i++) {
			const [name, data] = o[i];
			if (isArray(data)) {
				data.forEach(async item => {
					await itemPart1(`${name}[]`, item);
				});
			} else {
				await itemPart1(name, data);
			}
		}

		body.push(encoder.encode(`--${option.boundary}--`));
		return new Blob(body).arrayBuffer();
	}
}
export { FormDataFormat };
export default FormDataFormat;

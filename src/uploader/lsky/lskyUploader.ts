// Imports
import axios from "axios";
import { isJSONParse, get } from '@elinzy/e-utils';

// Class
import { Uploader } from "../uploader";

// Types
import { ISettings } from "../../type";

class LskyUploader extends Uploader {
	private readonly settings: ISettings;

	constructor(settings: ISettings) {
		super()

		this.settings = settings;
	}

	/**
	 * Upload
	 *
	 * @param file
	 */
	async upload(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const uploadBody = isJSONParse(this.settings.lskySetting.apiReqBody) ?
				JSON.parse(this.settings.lskySetting.apiReqBody) :
				this.settings.lskySetting.apiReqBody;

			// 查找 key 为 $FILE 字段并进行替换
			for (const key in uploadBody) {
				if (uploadBody[key] == "$FILE") {
					formData.append(key, file, file.name);
				}
				else {
					formData.append(key, uploadBody[key]);
				}
			}

			axios.post(this.settings.lskySetting.apiURL, formData, {
				"headers": JSON.parse(this.settings.lskySetting.apiReqHeader)
			})
				.then(res => {
					// NOTE: 兼容 `data.pathname` 与 `['data', ''pathname]` 方式
					const pathStr = isJSONParse(this.settings.lskySetting.imgUrlPath) ?
						JSON.parse(this.settings.lskySetting.imgUrlPath) :
						this.settings.lskySetting.imgUrlPath;

					const url = [
						this.settings.lskySetting.imgUrlPrefix,
						get(res.data, pathStr, ''),
					].join('')

					resolve(url);
				})
				.catch(err => {
						reject(err);
				})
		})
	}
}

export { LskyUploader };
export default LskyUploader;

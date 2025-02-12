// Imports
import { requestUrl } from "obsidian";
import { isJSONParse, get } from "@elinzy/e-utils";

// Class
import { Uploader } from "../uploader";

// Utils
import { getBoundary } from "../../utils/utils";
import { FormDataFormat } from "../../utils/formDataFormat";

// Types
import { ISettings } from "../../type";

class HaloUploader extends Uploader {
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
		return new Promise(async (resolve, reject) => {
			const formItems = new FormDataFormat();
			const uploadBody = isJSONParse(this.settings.haloSetting.apiReqBody) ?
				JSON.parse(this.settings.haloSetting.apiReqBody) :
				this.settings.haloSetting.apiReqBody;

			for (const key in uploadBody) {
				if (uploadBody[key] == "$FILE") {
					formItems.append(key, file)
				}
				else {
					formItems.append(key, uploadBody[key])
				}
			}

			const boundary = getBoundary();
			const reqBody = await formItems.toArrayBuffer({
				boundary
			})

			requestUrl({
				url: this.settings.haloSetting.apiURL,
				method: "POST",
				headers: {
					'user-agent': 'obsidian.md',
					...JSON.parse(this.settings.haloSetting.apiReqHeader),
					'Content-Type': `multipart/form-data; boundary=${boundary}`,
				},
				body: reqBody
			})
				.then(res => res.json)
				.then((res: {}) => {
					const pathStr = isJSONParse(this.settings.haloSetting.imgUrlPath) ?
						JSON.parse(this.settings.haloSetting.imgUrlPath) :
						this.settings.haloSetting.imgUrlPath;
					const url = [
						this.settings.haloSetting.imgUrlPrefix,
						get(res, pathStr, ''),
					].join('');

					resolve(url)
				})
				.catch(err => {
					reject(err)
				});

			// NOTE: Obsidian 是基于 Electron 开发的，对于请求 Halo 的接口来说相当于是在浏览器上请求的，所以存在跨域问题。
			// See: https://github.com/halo-sigs/obsidian-halo/issues/2
			// axios.post(this.settings.haloSetting.apiURL, formData, {
			// 	"headers": JSON.parse(this.settings.haloSetting.apiReqHeader),
			// 	withCredentials: true,
			// }).then(res => {
			// 	const url = [this.settings.haloSetting.imgUrlPrefix, objectPath.get(res.data, this.settings.haloSetting.imgUrlPath)].join('')
			//
			// 	resolve(url)
			// }, err => {
			// 	reject(err)
			// })

			// this.client.httpPost(
			// 	this.settings.haloSetting.apiURL,
			// 	formItems,
			// 	{
			// 		headers: JSON.parse(this.settings.haloSetting.apiReqHeader),
			// 	}
			// )
			// 	.then((res: {}) => {
			// 		const url = [
			// 			this.settings.haloSetting.imgUrlPrefix,
			// 			objectPath.get(res, JSON.parse(this.settings.haloSetting.imgUrlPath))
			// 		].join('');
			//
			// 		resolve(url)
			// 	})
			// 	.catch(err => {
			// 		reject(err)
			// 	});
		})
	}
}

export default HaloUploader;

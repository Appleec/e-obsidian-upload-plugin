// Defaults
import objectPath from "object-path";
import fileTypeChecker from 'file-type-checker';

// Types
import { IUploader, IUploadPluginSettings} from "./type";

// Utils
import { RestClient } from './utils/rest-client';
import { FormItems, Media, fileToArrayBuffer } from './utils/utils';
import {Notice} from "obsidian";

// Class
class HaloUpload implements IUploader {
	private readonly settings: IUploadPluginSettings;
	private readonly client: RestClient;

	constructor(settings: IUploadPluginSettings) {
		this.settings = settings;

		this.client = new RestClient();
	}

	async upload(file: File, options?: any): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const uploadBody = JSON.parse(this.settings.haloSetting.apiReqBody);

			const [buf, filename] = await fileToArrayBuffer(file);
			const fileType = fileTypeChecker.detectFile(buf);
			const media: Media = {
				mimeType: fileType?.mimeType ?? 'application/octet-stream',
				fileName: filename,
				content: buf
			}

			const formItems = new FormItems();
			for (const key in uploadBody) {
				if (uploadBody[key] == "$FILE") {
					formItems.append(key, media)
				}
				else {
					formItems.append(key, uploadBody[key])
				}
			}

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

			this.client.httpPost(
				this.settings.haloSetting.apiURL,
				formItems,
				{
					headers: JSON.parse(this.settings.haloSetting.apiReqHeader),
				}
			)
				.then((res: {}) => {
					const url = [
						this.settings.haloSetting.imgUrlPrefix,
						objectPath.get(res, JSON.parse(this.settings.haloSetting.imgUrlPath))
					].join('');

					resolve(url)
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	//
	drawSettingsTab(parentEL: HTMLDivElement) {

	}
}

export default HaloUpload;

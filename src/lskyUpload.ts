// Defaults
import { IUploadPluginSettings } from "./type";
import axios from "axios";
import objectPath from "object-path";

class LskyUpload {
	private readonly settings: IUploadPluginSettings;

	constructor(settings: IUploadPluginSettings) {
		this.settings = settings;
	}

	async upload(file: File, fullPath?: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const uploadBody = JSON.parse(this.settings.lskySetting.apiReqBody);

			for (const key in uploadBody) {
				if (uploadBody[key] == "$FILE") {
					formData.append(key, file, file.name)
				}
				else {
					formData.append(key, uploadBody[key])
				}
			}

			axios.post(this.settings.lskySetting.apiURL, formData, {
				"headers": JSON.parse(this.settings.lskySetting.apiReqHeader)
			}).then(res => {
				const url = [this.settings.lskySetting.imgUrlPrefix, objectPath.get(res.data, this.settings.lskySetting.imgUrlPath)].join('')

				resolve(url)
			}, err => {
				reject(err)
			})
		})
	}

	//
	drawSettingsTab(parentEL: HTMLDivElement) {

	}
}

export default LskyUpload;

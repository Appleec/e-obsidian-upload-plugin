// Imports
import axios from "axios";
import objectPath from "object-path";

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
			const uploadBody = JSON.parse(this.settings.lskySetting.apiReqBody);

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
			}).then(res => {
				const url = [this.settings.lskySetting.imgUrlPrefix, objectPath.get(res.data, this.settings.lskySetting.imgUrlPath)].join('')

				resolve(url)
			}, err => {
				reject(err)
			})
		})
	}
}

export { LskyUploader };
export default LskyUploader;

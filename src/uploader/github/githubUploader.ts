// Imports
import objectPath from "object-path";
import path from "path";
import { requestUrl } from "obsidian";

// Class
import { Uploader } from "../uploader";

// Utils
import { fileToBase64, getRandomFileName } from "../../utils/utils";

// Types
import { ISettings } from "../../type";

class GithubUploader extends Uploader {
	private readonly settings: ISettings;

	constructor(settings: ISettings) {
		super()

		this.settings = settings;
	}

	/**
	 * Upload
	 *
	 * See: https://docs.github.com/zh/rest/repos/contents?apiVersion=2022-11-28
	 *
	 * @param file
	 */
	async upload(file: File): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const uploadBody = JSON.parse(this.settings.githubSetting.apiReqBody);

			const requestBody: any = {
				owner: uploadBody.owner,
				repo: uploadBody.repo,
				branch: uploadBody.branch,
			};

			for (const key in uploadBody) {
				if (uploadBody[key].includes("$PATH")) {
					// NOTE: 随机数替换原文件名，避免冲突
					requestBody[key] = uploadBody[key].replace("$PATH", getRandomFileName(file.name));
					// requestBody[key] = uploadBody[key].replace("$PATH", file.name);
				} else if (uploadBody[key].includes("$CONTENT")) {
					requestBody[key] = await fileToBase64(file);
				} else {
					requestBody[key] = uploadBody[key];
				}
			}

			const url = path.join(`${this.settings.githubSetting.apiURL}`,`repos/${requestBody.owner}/${requestBody.repo}/contents/`, `${requestBody.path}`);
			// console.log('=>', url)
			// console.log('=>', requestBody)

			// 获取文件，检查是否已存在同名文件
			requestUrl({
				url,
				method: "PUT",
				headers: {
					'user-agent': 'obsidian.md',
					...JSON.parse(this.settings.githubSetting.apiReqHeader),
				},
				body: JSON.stringify(requestBody)
			})
				.then(res => res.json)
				.then((res: {}) => {
					const url = [
						this.settings.githubSetting.imgUrlPrefix,
						objectPath.get(res, JSON.parse(this.settings.githubSetting.imgUrlPath))
					].join('');

					resolve(url)
				})
				.catch(err => {
					// console.log(err);

					// Error: Request failed, status 422 => Validation failed, or the endpoint has been spammed.
					// 文件名冲突引起上传失败

					reject(err)
				});
		})
	}
}

export default GithubUploader;

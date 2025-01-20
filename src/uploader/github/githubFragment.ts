// Imports
import { Setting } from "obsidian";

import { EUploaderProvider } from "../../config";
import type UploadPlugin from "../../main";
import { Fragment } from "../fragment";

class GithubFragment extends Fragment{
	constructor(el: HTMLElement, plugin: UploadPlugin) {
		super(EUploaderProvider.Github, el, plugin);
	}

	display(el: HTMLElement, plugin: UploadPlugin): void {
		el.createEl('h3', { text: 'Github 设置' });

		// Api URL
		new Setting(el)
			.setName("API 请求地址")
			.setDesc("上传文件 API 地址，注意末尾不添加 `/`，如：https://api.github.com")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(plugin.settings.githubSetting.apiURL)
					.onChange(async (value) => {
						try {
							plugin.settings.githubSetting.apiURL = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.error(e);
						}
					})
			})

		// Api request header
		new Setting(el)
			.setName("API 请求头")
			.setDesc("POST Header，JSON 格式，替换 token [xxx] => Personal access tokens")
			.addTextArea((text) => {
				text.setPlaceholder("{\n" +
					"  \"Authorization\":\"token [xxx]\"\n" +
					"}")
					.setValue(plugin.settings.githubSetting.apiReqHeader)
					.onChange(async (value) => {
						try {
							plugin.settings.githubSetting.apiReqHeader = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.error(e);
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})

		// Api request body
		new Setting(el)
			.setName("API 请求体")
			.setDesc("POST Body，JSON 格式，尽量保留 $ 字段")
			.setTooltip("*owner: 用户, \n*repo: 仓库名, \n*path: 路径, \nbranch：分支, \n*message: 消息, \n*content: base64图片")
			.addTextArea((text) => {
				text.setPlaceholder("{\n" +
					"\"owner\": \"\",\n" +
					"\"repo\": \"\",\n" +
					"\"branch\": \"\",\n" +
					"\"path\": \"$PATH\",\n" +
					"\"message\": \"\",\n" +
					"\"content\": \"$CONTENT\"\n" +
					"}")
					.setValue(plugin.settings.githubSetting.apiReqBody)
					.onChange(async (value) => {
						try {
							plugin.settings.githubSetting.apiReqBody = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.error(e);
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})

		new Setting(el)
			.setName("图片 URL 路径")
			.setDesc("返回数据（Response）中图片 URL 字段路径，以 JSON 对象为例，如：data.pathname。本例：content.download_url（完整链接），content.path（局部路径）")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(plugin.settings.githubSetting.imgUrlPath)
					.onChange(async (value) => {
						try {
							plugin.settings.githubSetting.imgUrlPath = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.error(e);
						}
					})
			})

		new Setting(el)
			.setName("图片 URL 前缀")
			.setDesc("可选，当填入时，URL = 前缀 + 图片的路径值")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(plugin.settings.githubSetting.imgUrlPrefix)
					.onChange(async (value) => {
						try {
							plugin.settings.githubSetting.imgUrlPrefix = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.error(e);
						}
					})
			})
	}
}

export { GithubFragment }
export default GithubFragment;

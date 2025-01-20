// Imports
import { Setting } from "obsidian";

import { EUploaderProvider } from "../../config";
import type UploadPlugin from "../../main";
import { Fragment } from "../fragment";

class HaloFragment extends Fragment{
	constructor(el: HTMLElement, plugin: UploadPlugin) {
		super(EUploaderProvider.Halo, el, plugin);
	}

	display(el: HTMLElement, plugin: UploadPlugin): void {
		el.createEl('h3', { text: 'Halo 设置' });

		// Api URL
		new Setting(el)
			.setName("API 请求地址")
			.setDesc("上传文件 API 地址，注意末尾不添加 `/`，如：https://xxx.xxx.xxx/apis/api.console.halo.run/v1alpha1/attachments/upload")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(plugin.settings.haloSetting.apiURL)
					.onChange(async (value) => {
						try {
							plugin.settings.haloSetting.apiURL = value;
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
			.setDesc("POST Header，JSON 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求头")
					.setValue(plugin.settings.haloSetting.apiReqHeader)
					.onChange(async (value) => {
						try {
							plugin.settings.haloSetting.apiReqHeader = value;
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
			.setDesc("POST Body，JSON 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求体")
					.setValue(plugin.settings.haloSetting.apiReqBody)
					.onChange(async (value) => {
						try {
							plugin.settings.haloSetting.apiReqBody = value;
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
			.setDesc("返回数据（Response）中图片 URL 字段路径，以 JSON 对象为例，如：data.pathname")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(plugin.settings.haloSetting.imgUrlPath)
					.onChange(async (value) => {
						try {
							plugin.settings.haloSetting.imgUrlPath = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.error(e);
						}
					})
			})

		new Setting(el)
			.setName("图片 URL 前缀")
			.setDesc("可选，当填入时，此值将插入到图片 URL 路径之前，即：URL = 前缀 + 图片 URL 路径")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(plugin.settings.haloSetting.imgUrlPrefix)
					.onChange(async (value) => {
						try {
							plugin.settings.haloSetting.imgUrlPrefix = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.error(e);
						}
					})
			})
	}
}

export { HaloFragment }
export default HaloFragment;

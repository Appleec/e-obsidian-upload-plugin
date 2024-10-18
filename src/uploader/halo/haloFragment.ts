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
			.setName("API 地址")
			.setDesc("请求地址")
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
							console.log(e)
						}
					})
			})

		// Api request header
		new Setting(el)
			.setName("POST Header")
			.setDesc("请求头，json 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求头")
					.setValue(plugin.settings.haloSetting.apiReqHeader)
					.onChange(async (value) => {
						try {
							plugin.settings.haloSetting.apiReqHeader = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})

		// Api request body
		new Setting(el)
			.setName("POST Body")
			.setDesc("请求体，json 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求体")
					.setValue(plugin.settings.haloSetting.apiReqBody)
					.onChange(async (value) => {
						try {
							plugin.settings.haloSetting.apiReqBody = value;
							await plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})

		new Setting(el)
			.setName("图片 URL 路径")
			.setDesc("返回json数据中的图片URL字段的路径，如：data/pathname")
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
							console.log(e)
						}
					})
			})

		new Setting(el)
			.setName("图片 URL 前缀")
			.setDesc("可选，当填入时，URL = 前缀 + 图片的路径值")
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
							console.log(e)
						}
					})
			})
	}
}

export { HaloFragment }
export default HaloFragment;

// Default
import {
	App,
	PluginSettingTab,
	Setting,
} from 'obsidian';

// Class
import UploadPlugin from './main';

// Utils
import { modes } from './config';

// Settings Tab
class UploadSettingsTab extends PluginSettingTab {
	plugin: UploadPlugin;

	// 定义三种 DIV 容器
	defaultDiv: HTMLDivElement; // 默认容器，存放公共配置
	modeDiv: HTMLDivElement; // 模式容器，存放不同模式下的配置
	otherDiv: HTMLDivElement; // 其它容器，存放额外配置

	constructor(app: App, plugin: UploadPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// 设置大标题
		containerEl.createEl("h1", { text: "上传设置" });

		// 默认配置
		this.defaultDiv = containerEl.createDiv();
		this.drawDefaultSettings(this.defaultDiv);

		// 模式配置
		this.modeDiv = containerEl.createDiv();
		this.drawModeSettings(this.modeDiv, this.plugin.settings.mode);

		// 其它配置
		this.otherDiv = containerEl.createDiv();
		this.drawOtherSettings(this.otherDiv);
	}

	// 自定义方法
	// 默认配置
	private drawDefaultSettings(parentEl: HTMLDivElement) {
		new Setting(parentEl)
			.setName('模式')
			.setDesc('选择一种模式')
			.addDropdown(e => {
				modes.forEach((m) => {
					e.addOption(m.value, m.text);
				})

				e.setValue(this.plugin.settings.mode)
				e.onChange(async value => {
					this.plugin.settings.mode = value;
					// NOTE: 重新设置uploader
					this.plugin.setupUploader();
					await this.plugin.saveSettings();
					await this.drawModeSettings(this.modeDiv, value);
				})
			})
	}

	// 模式配置
	// 切换模式，不同的模式对应不同的配置
	private async drawModeSettings(parentEl: HTMLDivElement, args: any) {
		parentEl && parentEl.empty();

		switch (args) {
			case 'lsky':
				this.drawLskySettings(parentEl);
				break;
			case 'halo':
				this.drawHaloSettings(parentEl);
				break;
			case 'github':
				this.drawGithubSettings(parentEl);
				break;
			default:
				break;
		}
	}

	// 其它配置
	private drawOtherSettings(parentEl: HTMLDivElement) {

	}

	// Lskypro 设置
	private drawLskySettings(parentEL: HTMLDivElement) {
		// Api URL
		new Setting(parentEL)
			.setName("API 地址")
			.setDesc("请求地址")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.lskySetting.apiURL)
					.onChange(async (value) => {
						try {
							this.plugin.settings.lskySetting.apiURL = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
			})

		// Api request header
		new Setting(parentEL)
			.setName("POST Header")
			.setDesc("请求头，json 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求头")
					.setValue(this.plugin.settings.lskySetting.apiReqHeader)
					.onChange(async (value) => {
						try {
							this.plugin.settings.lskySetting.apiReqHeader = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})

		// Api request body
		new Setting(parentEL)
			.setName("POST Body")
			.setDesc("请求体，json 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求体")
					.setValue(this.plugin.settings.lskySetting.apiReqBody)
					.onChange(async (value) => {
						try {
							this.plugin.settings.lskySetting.apiReqBody = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})
		new Setting(parentEL)
			.setName("图片 URL 路径")
			.setDesc("返回json数据中的图片URL字段的路径，如：data.pathname")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.lskySetting.imgUrlPath)
					.onChange(async (value) => {
						try {
							this.plugin.settings.lskySetting.imgUrlPath = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
			})

		new Setting(parentEL)
			.setName("图片 URL 前缀")
			.setDesc("可选，当填入时，URL = 前缀 + 图片的路径值")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.lskySetting.imgUrlPrefix)
					.onChange(async (value) => {
						try {
							this.plugin.settings.lskySetting.imgUrlPrefix = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
			})
	}

	// Halo 设置
	private drawHaloSettings(parentEL: HTMLDivElement) {
		// Api URL
		new Setting(parentEL)
			.setName("API 地址")
			.setDesc("请求地址")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.haloSetting.apiURL)
					.onChange(async (value) => {
						try {
							this.plugin.settings.haloSetting.apiURL = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
			})

		// Api request header
		new Setting(parentEL)
			.setName("POST Header")
			.setDesc("请求头，json 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求头")
					.setValue(this.plugin.settings.haloSetting.apiReqHeader)
					.onChange(async (value) => {
						try {
							this.plugin.settings.haloSetting.apiReqHeader = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})

		// Api request body
		new Setting(parentEL)
			.setName("POST Body")
			.setDesc("请求体，json 格式")
			.addTextArea((text) => {
				text.setPlaceholder("输入合法的请求体")
					.setValue(this.plugin.settings.haloSetting.apiReqBody)
					.onChange(async (value) => {
						try {
							this.plugin.settings.haloSetting.apiReqBody = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
				text.inputEl.rows = 5
				text.inputEl.cols = 40
			})
		new Setting(parentEL)
			.setName("图片 URL 路径")
			.setDesc("返回json数据中的图片URL字段的路径，如：['data', 'pathname'] => data.pathname")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.haloSetting.imgUrlPath)
					.onChange(async (value) => {
						try {
							this.plugin.settings.haloSetting.imgUrlPath = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
			})

		new Setting(parentEL)
			.setName("图片 URL 前缀")
			.setDesc("可选，当填入时，URL = 前缀 + 图片的路径值")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.haloSetting.imgUrlPrefix)
					.onChange(async (value) => {
						try {
							this.plugin.settings.haloSetting.imgUrlPrefix = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
			})
	}

	// Github 设置
	private drawGithubSettings(parentEL: HTMLDivElement) {}
}

export default UploadSettingsTab;

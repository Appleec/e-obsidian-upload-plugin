import {
	App,
	Editor,
	MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting,

	Menu,
	MenuItem,
	TFile,
	FileSystemAdapter,
	addIcon,
} from 'obsidian';

import { readFile } from "fs";
import axios from "axios";
import objectPath from 'object-path';
import { resolve, relative, join, parse, posix, basename, dirname } from "path";

import Helper from "./helper";
import { isAssetTypeAnImage, bufferToArrayBuffer } from "./utils";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	uploader: string;

	mode: string;
	apiURL: string;
	apiReqHeader: string;
	apiReqBody: string;

	imgUrlPath: string;
	imgUrlPrefix: string;

	lskySetting: ILskySettings;
}

interface ILskySettings {
	endpoint: string;
	reqHeader: string;
	reqBody: string;
	imgUrlPath: string;
	imgUrlPrefix: string;
}
interface IImage {
	path: string;
	name: string;
	source: string;
}

// 默认设置
const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	uploader: 'lsky',

	mode: 'lsky',
	apiURL: '',
	apiReqHeader: '',
	apiReqBody: "{\"image\": \"$FILE\"}",

	imgUrlPath: '',
	imgUrlPrefix: '',

	lskySetting: {
		endpoint: '',
		reqHeader: '',
		reqBody: '',
		imgUrlPath: '',
		imgUrlPrefix: '',
	},
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	// 自定义
	helper: Helper;
	editor: Editor;

	async onload() {
		await this.loadSettings();

		// T
		this.helper = new Helper(this.app);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Upload Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// 注册事件，添加右键菜单项
		this.registerFileMenu();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// 自定义方法
	// 上传操作
	async uploadFile(image: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const uploadBody = JSON.parse(this.settings.apiReqBody);

			for (const key in uploadBody) {
				if (uploadBody[key] == "$FILE") {
					formData.append(key, image, image.name)
				}
				else {
					formData.append(key, uploadBody[key])
				}
			}

			axios.post(this.settings.apiURL, formData, {
				"headers": JSON.parse(this.settings.apiReqHeader)
			}).then(res => {
				const url = [this.settings.imgUrlPrefix, objectPath.get(res.data, this.settings.imgUrlPath)].join('')

				resolve(url)
			}, err => {
				reject(err)
			})
		})
	}

	async uploadMenuFile(file: TFile) {
		let content = this.helper.getValue();

		const basePath = (
			this.app.vault.adapter as FileSystemAdapter
		).getBasePath();

		let imageList: IImage[] = [];
		const fileArray = this.helper.getAllFiles();

		for (const match of fileArray) {
			const imageName = match.name;
			const encodedUri = match.path;

			const fileName = basename(decodeURI(encodedUri));

			if (file && file.name === fileName) {
				const abstractImageFile = join(basePath, file.path);

				if (isAssetTypeAnImage(abstractImageFile)) {
					imageList.push({
						path: abstractImageFile,
						name: imageName,
						source: match.source,
					});
				}
			}
		}

		if (imageList.length === 0) {
			new Notice("没有找到文件");
			return;
		}

		const fileList = imageList.map(item => item.path);
		const files = [];

		for (let i = 0; i < fileList.length; i++) {
			const file = fileList[i];
			const buffer: Buffer = await new Promise((resolve, reject) => {
				readFile(file, (err, data) => {
					if (err) {
						reject(err);
					}
					resolve(data);
				});
			});
			const arrayBuffer = bufferToArrayBuffer(buffer);
			files.push(new File([arrayBuffer], file));
		}

		if (files.length === 0) {
			new Notice("没有找到文件");
			return;
		}

		// 上传
		this.uploadFile(files[0])
			.then(res => {
				imageList.map(item => {
					content = content.replaceAll(
						item.source,
						`![](${res})`
					);
				});

				this.helper.setValue(content);

				new Notice("上传成功");
			})
			.catch(err => {
				new Notice(`上传失败: ${err}`);
			});
	}

	// 添加右键菜单项
	registerFileMenu() {
		this.registerEvent(
			this.app.workspace.on(
				"file-menu",
				(menu: Menu, file: TFile, source: string, leaf) => {
					if (source === "canvas-menu") return false;
					if (!isAssetTypeAnImage(file.path)) return false;

					menu.addItem((item: MenuItem) => {
						item
							.setTitle("上传文件")
							.setIcon("upload")
							.onClick(() => {
								if (!(file instanceof TFile)) {
									return false;
								}
								new Notice('准备上传');
								this.uploadMenuFile(file);
							});
					});
				}
			)
		);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		let defaultDiv: HTMLDivElement, modeDiv: HTMLDivElement, otherDiv: HTMLDivElement;

		/*大标题*/
		containerEl.createEl("h1", {text: "上传设置"});

		/*默认配置*/
		defaultDiv = containerEl.createDiv();
		// 模式
		new Setting(defaultDiv)
			.setName('模式')
			.setDesc('选择一种模式')
			.addDropdown(e => {
				e.addOption("lsky", "Lsky")
				e.addOption("halo", "Halo")
				e.setValue(this.plugin.settings.mode)
				e.onChange(async value => {
					this.plugin.settings.mode = value;
					// await this.plugin.saveSettings();

					await this.selectModeSettings(value, modeDiv);
				})
			})

		/*模式配置*/
		modeDiv = containerEl.createDiv()
		this.plugin.settings.mode === 'lsky' && this.selectModeSettings(this.plugin.settings.mode, modeDiv);

		/*其它配置*/
	}

	// 自定义方法
	// 切换模式，不同的模式对应不同的配置
	private async selectModeSettings(value: any, parentEl: HTMLDivElement) {
		parentEl && parentEl.empty();

		switch (value) {
			case 'lsky':
				this.drawLskySettings(parentEl);
				break;
			default:
				break;
		}
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
					.setValue(this.plugin.settings.apiURL)
					.onChange(async (value) => {
						try {
							this.plugin.settings.apiURL = value;
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
					.setValue(this.plugin.settings.apiReqHeader)
					.onChange(async (value) => {
						try {
							this.plugin.settings.apiReqHeader = value;
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
					.setValue(this.plugin.settings.apiReqBody)
					.onChange(async (value) => {
						try {
							this.plugin.settings.apiReqBody = value;
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
			.setDesc("返回json数据中的图片URL字段的路径，如：data/pathname")
			.addText(text => {
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.imgUrlPath)
					.onChange(async (value) => {
						try {
							this.plugin.settings.imgUrlPath = value;
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
					.setValue(this.plugin.settings.imgUrlPrefix)
					.onChange(async (value) => {
						try {
							this.plugin.settings.imgUrlPrefix = value;
							await this.plugin.saveSettings();
						}
						catch (e) {
							console.log(e)
						}
					})
			})
	}
}

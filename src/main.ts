import {
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	Menu,
	MenuItem,
	TFile,
	FileSystemAdapter,
	addIcon,
} from 'obsidian';

import { readFile } from 'fs';
import { join, basename } from 'path';

// Utils
import Helper from "./utils/helper";
import { isAssetTypeAnImage, bufferToArrayBuffer } from "./utils/utils";
import uploader from "./uploader";

// Class
import UploadSettingTab from './settings-tab';
import UploadModal from './modal';

// Types
import { IUploadPluginSettings, IImage, IUploader } from './type';

// Remember to rename these classes and interfaces!

// 默认选项
const DEFAULT_SETTINGS: IUploadPluginSettings = {
	mode: 'lsky',
	apiURL: '',
	apiReqHeader: '',
	apiReqBody: "{\"file\": \"$FILE\"}",

	imgUrlPath: '',
	imgUrlPrefix: '',

	lskySetting: {
		apiURL: "",
		apiReqHeader: "",
		apiReqBody: "{\"file\": \"$FILE\"}",
		imgUrlPath: "",
		imgUrlPrefix: "",
	}
}

class UploadPlugin extends Plugin {
	settings: IUploadPluginSettings;

	// 自定义
	helper: Helper;
	editor: Editor;

	// Uploader
	uploader: IUploader;

	async onload() {
		// 加载设置
		await this.loadSettings();

		// 赋值
		this.helper = new Helper(this.app);
		this.uploader = uploader(this.settings);

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
				new UploadModal(this.app).open();
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
						new UploadModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// 注册事件，添加右键菜单项
		this.registerMenuEvent();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new UploadSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// 自定义方法
	// 右键菜单上传文件
	async menuUploadFile(file: TFile) {
		new Notice('准备上传');

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

		if (!this.uploader) {
			new Notice("上传配置加载失败，请检查设置");
			return;
		}

		// 上传
		this.uploader.upload(files[0])
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

	// 注册右键菜单事件
	registerMenuEvent() {
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
								this.menuUploadFile(file);
							});
					});
				}
			)
		);
	}
}

export default UploadPlugin;

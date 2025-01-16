// Imports
import {
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	Menu,
	MenuItem,
	TFile,
	FileSystemAdapter,
	Workspace,
} from 'obsidian';

import { readFile } from 'fs';
import { join, basename } from 'path';

// Icons
import { addCustomRibbonIcon } from './icons';

// Utils
import Helper from "./utils/helper";
import { isAssetTypeAnImage, bufferToArrayBuffer } from "./utils/utils";

// Class
import UploadSettingTab from './settings-tab';
import UploadModal from './modal';
import uploaderBuilder from './uploader/builder';

// Types
import { IImage, IUploader, ISettings } from './type';

// Utils
import { DEFAULT_SETTINGS } from './config';

// Remember to rename these classes and interfaces!

class UploadPlugin extends Plugin {
	settings: ISettings; // 声明设置
	appPlugins: any; // 声明插件
	appWorkspace: Workspace; // 声明工作空间
	helper: Helper; // 声明辅助工具
	uploader: IUploader; // 声明上传器Uploader

	async onload() {
		console.log(`%c ${this.manifest.name} %c v${this.manifest.version} `, `padding: 2px; border-radius: 2px 0 0 2px; color: #fff; background: #5B5B5B;`, `padding: 2px; border-radius: 0 2px 2px 0; color: #fff; background: #409EFF;`);

		// 加载配置
		await this.loadSettings();

		// 加载工具
		// @ts-ignore
		this.appPlugins = this.app.plugins;
		this.appWorkspace = this.app.workspace;
		this.helper = new Helper(this.app); // 自定义方法

		// 启动上传器
		this.setupUploader();

		// 添加自定义图标
		addCustomRibbonIcon(this);

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

	async onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// 自定义方法
	// 右键菜单上传文件
	async menuUploadFileTest(file: TFile) {
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

	async menuUploadFile(file: TFile) {
		if (!file) {
			new Notice('不合法文件，请重新尝试');
			return;
		}
		if (!this.uploader) {
			new Notice("未配置上传器，请检查设置");
			return;
		}

		new Notice('准备上传');

		let content = this.helper.getValue();
		const basePath = this.helper.getBasePath();
		const fileArray = this.helper.getAllFiles();

		let imageList: IImage[] = [];

		// 查找文档中相同路径文件
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
			new Notice("没有匹配到文件");
			return;
		}

		const files = [];

		// 通过文件路径读取文件，并转化为文件格式
		for (let i = 0; i < imageList.length; i++) {
			const { path, name } = imageList[i];
			const fileName = basename(decodeURI(path));
			const buffer: Buffer = await new Promise((resolve, reject) => {
				readFile(path, (err, data) => {
					if (err) {
						reject(err);
					}
					resolve(data);
				});
			});
			const arrayBuffer = bufferToArrayBuffer(buffer);
			files.push(new File([arrayBuffer], fileName));
		}

		if (files.length === 0) {
			new Notice("文件读取失败");
			return;
		}

		// 通过uploader上传文件
		this.uploader.upload(files[0])
			.then(res => {
				// 文件上传成功后，替换文档中相同路径文件的link
				imageList.map(item => {
					content = content.replaceAll(
						item.source,
						`![](${res})`
					);
				});

				// 更新文档
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
							.setTitle("E Upload")
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

	// 设置 uploader
	setupUploader() {
		try {
			this.uploader = uploaderBuilder(this.settings);
		} catch (e) {
			console.log(`启动 Uploader 失败: ${e}`);
		}
	}
}

export default UploadPlugin;

import {
	App,
	Modal,
	Notice, Setting,
} from 'obsidian';

class UploadModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');

		new Setting(contentEl)
			.setName("图片 URL 前缀")
			.setDesc("可选，当填入时，URL = 前缀 + 图片的路径值")
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

export default UploadModal;

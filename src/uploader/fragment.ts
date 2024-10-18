// Types
import type { EUploaderProvider } from "../config";
import type UploadPlugin from "../main";

abstract class Fragment {
	mode: EUploaderProvider;
	el: HTMLElement;

	protected constructor(mode: EUploaderProvider, el: HTMLElement, plugin: UploadPlugin) {
		this.mode = mode;
		this.el = el.createDiv(mode);

		this.display(this.el, plugin);
		this.el.hide();
	}

	abstract display(el: HTMLElement, plugin: UploadPlugin): void

	update (choice: EUploaderProvider): void {
		this.mode === choice ? this.el.show() : this.el.hide();
	}
}

export { Fragment };
export default Fragment;

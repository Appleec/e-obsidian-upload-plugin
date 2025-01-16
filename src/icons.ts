// Imports
import { addIcon, Notice, Plugin } from "obsidian";

// Types
import UploadPlugin from "./main";

const svg = `<svg t="1728792346606" class="icon" viewBox="60 60 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1472" width="120" height="120" fill="#707070"><path d="M384 298.666667h256v85.333333h-170.666667v85.333333h170.666667v85.333334h-170.666667v85.333333h170.666667v85.333333H384V298.666667zM128 213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h597.333334a85.333333 85.333333 0 0 1 85.333333 85.333333v597.333334a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333z m85.333333 0v597.333334h597.333334V213.333333H213.333333z" p-id="1473" data-spm-anchor-id="a313x.search_index.0.i0.54d23a81JCWFR2" class="selected"></path></svg>`;

export function addCustomIcon() {
	// Add Custom Icon
	addIcon("upload", svg);
}

export function addCustomRibbonIcon(that: UploadPlugin) {
	addCustomIcon();

	// This creates an icon in the left ribbon.
	const ribbonIconEl = that.addRibbonIcon('upload', 'EUpload', (evt: MouseEvent) => {
		// Called when the user clicks the icon.
		new Notice('This is a notice!');
	});

	// Perform additional things with the ribbon
	ribbonIconEl.addClass('my-plugin-ribbon-class');
}

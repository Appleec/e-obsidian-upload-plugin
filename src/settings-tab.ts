// Default
import {
	App, Notice,
	PluginSettingTab,
	Setting,
} from 'obsidian';

// Class
import UploadPlugin from './main';

// Uploader Fragment
import type { Fragment } from './uploader/fragment';
import { LskyFragment } from './uploader/lsky/lskyFragment';
import { HaloFragment } from './uploader/halo/haloFragment';
import { GithubFragment } from './uploader/github/githubFragment';

// Utils
import { EUploaderProvider } from './config';

// Settings Tab
class UploadSettingsTab extends PluginSettingTab {
	private readonly plugin: UploadPlugin;

	constructor(app: App, plugin: UploadPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Set title
		containerEl.createEl("h1", { text: "上传设置" });

		// Choice the mode
		const pick = new Setting(containerEl)
			.setName('模式')
			.setDesc('选择一种模式')

		// Fragments
		const fragmentList: Fragment[] = [];
		fragmentList.push(new LskyFragment(containerEl, this.plugin)); // Lsky
		fragmentList.push(new HaloFragment(containerEl, this.plugin)); // Halo
		fragmentList.push(new GithubFragment(containerEl, this.plugin)); // Github

		// Which one will show at the first time
		fragmentList.forEach(element => {
			element.update(this.plugin.settings.mode)
		})

		// Uploader provider
		const supportList: string[] = [];
		for (const key in EUploaderProvider) {
			supportList.push(EUploaderProvider[key as keyof typeof EUploaderProvider]);
		}

		// Choose different modes and update different configurations
		pick.addDropdown(dd => {
			supportList.forEach((m) => {
				dd.addOption(m, m);
			})

			dd.setValue(this.plugin.settings.mode)
				.onChange(async value => {
					this.plugin.settings.mode = value as EUploaderProvider;
					await this.plugin.saveSettings();
					// NOTE: 重新设置 Uploader
					this.plugin.setupUploader();

					fragmentList.forEach(element => {
						element.update(this.plugin.settings.mode) // update the tab when make a choice
					})
				})
			})
	}
}

export default UploadSettingsTab;

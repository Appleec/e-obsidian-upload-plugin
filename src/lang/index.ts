// Imports
import i18next from "i18next";
import { moment } from "obsidian";

// Configuration
// import { DEFAULT_SETTINGS } from './../config';

// locale file
import en from './locale/en';
import zhCN from './locale/zh-cn';

// locale list
// import { locales } from './locales';
// const languagePattern = locales.map(lang => lang.alternate || lang.locale).join('|');
// const languageRegexp = new RegExp(`^(${languagePattern})$`);

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
	'zh-cn': zhCN,
	// 'en-us': en_us,
};

const locale = localeMap[moment.locale()];

export const resources = {
	en: { translation: en },
	"zh-CN": { translation: zhCN },
}

export function t(str: keyof typeof en): string {
	if (!locale) {
		console.error("Error: EUpload locale not found", moment.locale());
	}

	// @ts-ignore
	return (locale && locale[str]) || en[str];
}

export const setupI18n = async (app: any) => {
	await i18next.init({
		lng: app?.settings?.locale || moment.locale(),
		fallbackLng: "en",
		resources,
		returnNull: false,
	});
}

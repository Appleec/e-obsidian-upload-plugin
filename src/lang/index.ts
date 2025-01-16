// Imports
import i18next from "i18next";
import { moment } from "obsidian";

// Configuration
// import { DEFAULT_SETTINGS } from './../config';

// locale file
import en from './locale/en';
import zhCN from './locale/zh-cn';

// locale list
import { locales } from './locales';
const languagePattern = locales.map(lang => lang.alternate || lang.locale).join('|');
const languageRegexp = new RegExp(`^(${languagePattern})$`);

// const localeMap: { [k: string]: Partial<typeof zh_cn> } = {
// 	'zh-cn': zh_cn,
// 	// 'en-us': en_us,
// };
// // console.log(moment.locale())
// const locale = localeMap[moment.locale()];

const locale = moment.locale();

export const resources = {
	en: { translation: en },
	"zh-CN": { translation: zhCN },
}

export function t(str: keyof typeof zhCN): string {
	console.log('=>', zhCN[str])
	return '';
}

export const setupI18n = async (app: any) => {
	await i18next.init({
		lng: app?.settings?.locale || moment.locale(),
		fallbackLng: "en",
		resources,
		returnNull: false,
	});
}

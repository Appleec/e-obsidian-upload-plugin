import type { EUploaderProvider } from "./config";

/**
 * Public
 */
export type SafeAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Default settings
 */
export interface ISettings {
	locale: any;
	mode: EUploaderProvider;
	modes?: any[];
	lskySetting: ISettingsItem;
	haloSetting: ISettingsItem;
	githubSetting: ISettingsItem;
}
export interface ISettingsItem {
	apiURL: string;
	apiReqHeader: string;
	apiReqBody: string;
	imgUrlPath: string;
	imgUrlPrefix: string;
}

/**
 * Uploader
 */
export interface IUploader {
	upload(file: File | IMedia, options?: Record<any, any>): Promise<string>;
}

/**
 * Relate File
 */
export interface IImage {
	path: string;
	name: string;
	source: string;
}
export interface IMedia {
	mimeType: string;
	fileName: string;
	content: ArrayBuffer;
}

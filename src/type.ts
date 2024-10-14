export interface ILskySettings {
	apiURL: string;
	apiReqHeader: string;
	apiReqBody: string;
	imgUrlPath: string;
	imgUrlPrefix: string;
}

export interface IImage {
	path: string;
	name: string;
	source: string;
}

export interface IUploadPluginSettings {
	mode: string;
	apiURL: string;
	apiReqHeader: string;
	apiReqBody: string;

	imgUrlPath: string;
	imgUrlPrefix: string;

	lskySetting: ILskySettings;
	haloSetting: ILskySettings;
}

export interface IUploader {
	upload(file: File | IMedia, options?: Record<any, any>): Promise<string>;
}

export interface IMedia {
	mimeType: string;
	fileName: string;
	content: ArrayBuffer;
}
export type SafeAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any

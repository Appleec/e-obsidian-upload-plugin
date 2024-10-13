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
}

export interface IUploader {
	upload(file: File, fullPath?: string): Promise<string>;
}

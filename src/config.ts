// Types
import { ISettings } from "./type";

export enum EUploaderProvider {
	Lsky = 'Lsky',
	Halo = 'Halo',
	Github = 'Github',
}

export const DEFAULT_SETTINGS: ISettings = {
	locale: 'zh-CN',
	mode: EUploaderProvider.Lsky,
	modes: [
		{
			text: 'Lskypro',
			value: 'lsky',
		},
		{
			text: 'Halo',
			value: 'halo',
		},
		{
			text: 'Github',
			value: 'github',
		},
	],
	lskySetting: {
		apiURL: "",
		apiReqHeader: "",
		apiReqBody: "{\"file\": \"$FILE\"}",
		imgUrlPath: "",
		imgUrlPrefix: "",
	},
	haloSetting: {
		// See: https://api.halo.run/#/
		apiURL: "",
		apiReqHeader: "",
		apiReqBody: "{\"file\": \"$FILE\"}",
		imgUrlPath: "",
		imgUrlPrefix: "",
	},
	githubSetting: {
		apiURL: "https://api.github.com",
		apiReqHeader: "{\n  \"Authorization\":\"token [xxx]\"\n}",
		apiReqBody: "{\n\"owner\": \"\",\n\"repo\": \"\",\n\"branch\": \"\",\n\"path\": \"$PATH\",\n\"message\": \"\",\n\"content\": \"$CONTENT\"\n}",
		imgUrlPath: "",
		imgUrlPrefix: "",
	}
}
export const { mode, modes } = DEFAULT_SETTINGS;
export default DEFAULT_SETTINGS;

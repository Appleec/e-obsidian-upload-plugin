const config = {
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
		"apiURL": "",
		"apiReqHeader": {},
		"apiReqBody": {},
		"imgUrlPath": "",
		"imgUrlPrefix": ""
	},
	haloSetting: {
		// See: https://api.halo.run/#/
		"apiURL": "",
		"apiReqHeader": {},
		"apiReqBody": {},
		"imgUrlPath": "",
		"imgUrlPrefix": ""
	}
}

export const { modes } = config;
export default config;

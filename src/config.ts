const config = {
	modes: [
		{
			text: 'Lskypro',
			value: 'lsky',
		},
		{
			text: 'Github',
			value: 'github',
		},
	],
	reqHeader: {
		"Authorization": "Bearer Jq7mTKdjN7BxMjLoG8Jj8eaGGV2GuurwumOGFCBm",
		"Accept": "application/json",
		"Content-Type": "multipart/form-data"
	},
	reqBody: {
		"file": "$FILE",
		"strategy_id": 2
	}
}

export const { modes } = config;
export default config;

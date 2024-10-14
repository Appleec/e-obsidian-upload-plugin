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
		"apiURL": "https://img.elinzy.com/api/v1/upload",
		"apiReqHeader": {
			"Authorization": "Bearer Jq7mTKdjN7BxMjLoG8Jj8eaGGV2GuurwumOGFCBm",
			"Accept": "application/json",
			"Content-Type": "multipart/form-data"
		},
		"apiReqBody": {
			"file": "$FILE",
			"strategy_id": 2
		},
		"imgUrlPath": "data.pathname",
		"imgUrlPrefix": "https://blog.elinzy.com/upload/eblog/"
	},
	haloSetting: {
		// See: https://api.halo.run/#/
		"apiURL": "https://blog.elinzy.com/apis/api.console.halo.run/v1alpha1/attachments/upload",
		"apiReqHeader": {
			"Authorization": "Bearer pat_eyJraWQiOiI1SG9MUWVvUW10bV9zd2JISFRSODFEd1dUWVNyUUlyc0N3NjE2R1dQTXpnIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2Jsb2cuZWxpbnp5LmNvbS8iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcxMTk1NjY5MiwianRpIjoiN2E5NDY3NjEtY2QzYi1kODc4LTJkOGMtZWQxNmUwZDk4NzFjIiwicGF0X25hbWUiOiJwYXQtYWRtaW4tbkdnZG0ifQ.cl7n0f9SqP5qwYUW2ZM6DL6Ex6Xh9GvxL_hwEDJuUn8tlyuzOhcjUqkGSCO1D8E0lqym7RtV7xDQzSLkQybKbSwRqeMEDbLbdLMDpzD2Vu1aptz5m0ifsm9pvpm2Wqnn_px68arhqHqmMwP-8N9F1m-fMu1ovBuXI2gzHA56Ne1yWsSObeasxqNP1CNsez_abdv0fPKxbBsV_2JrQeHYc0y90M8V0WZ9d3_zdrgOMg6Hm481VprrHUwB9nxrsVsCxd_ROwf93ZhGo_VPV5YG8_Pz4CwRGzkIABVHO1leUXyMD24nOpG9csGo-mauuik7oi1h6eLUMi2902qKFUctwRsF4lKQSP6h2Li9UUt0FYQp78uaTDbke3eAxLq1nqWfOn3Lplpe1tz8MPXtZGclx2xz4zkQWs5TdOU4cuukMIJoXfc1VCbAR9AuaG1BVMZYnL-scgg9I9GNHjtcfgFMskUaEKQlyYTNiIweaqQHMlBHvdxJjCMko9jdB2qnMNw9cs2QfMreK278A6ucHMOB9WGVh0thpor1gk2MvAcV3k-ai21BKUdOLooxftdXbI7V9xif_fLEZwFvtf2RtRqChJpXLyGS2-xoOwg00kz0khckv43vntSCPZ8pqHnTAWsy_ssf80WOajs2guY25l04PXAshEGndvziB0Aod3AoXdY",
			"Content-Type": "multipart/form-data",
			"Host": "blog.elinzy.com",
		},
		"apiReqBody": {
			"file": "$FILE",
			"policyName": "attachment-policy-gUpSV", // 策略
			"groupName": "attachment-group-JWlvm" // 分组
		},
		"imgUrlPath": "data.metadata.annotations['storage.halo.run/uri']",
		"imgUrlPrefix": "https://blog.elinzy.com/"
	}
}

export const { modes } = config;
export default config;

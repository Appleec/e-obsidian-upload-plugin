import { requestUrl } from 'obsidian';
import { getBoundary, FormItems, type FormItemNameMapper } from './utils';

interface RestOptions {
  url: URL;
}

export class RestClient {
  constructor(
    private readonly options?: RestOptions
  ) {
    console.log(options);
  }

  async httpGet(
	  url: string,
	  options?: {
		  headers: Record<string, string>
	  }
  ): Promise<unknown> {
	  const endpoint = url;
	  const opts = {
		  headers: {},
		  ...options
	  };
	  console.log('REST GET', endpoint, opts);
	  const response = await requestUrl({
		  url: endpoint,
		  method: 'GET',
		  headers: {
			  'content-type': 'application/json',
			  'user-agent': 'obsidian.md',
			  ...opts.headers
		  }
	  });
	  console.log('GET response', response);
	  return response.json;
  }

  async httpPost(
	  url: string,
	  body: any,
	  options?: {
		  headers: Record<string, string>;
		  formItemNameMapper?: FormItemNameMapper;
	  }
  ): Promise<unknown> {
	  const endpoint = url;
	  const predefinedHeaders: Record<string, string> = {};
	  let requestBody: any;

	  if (body instanceof FormItems) {
		  const boundary = getBoundary();
		  requestBody = await body.toArrayBuffer({
			  boundary,
			  nameMapper: options?.formItemNameMapper
		  });
		  predefinedHeaders['content-type'] = `multipart/form-data; boundary=${boundary}`;
	  } else if (body instanceof ArrayBuffer) {
		  requestBody = body;
	  } else {
		  requestBody = JSON.stringify(body);
		  predefinedHeaders['content-type'] = 'application/json';
	  }

	  const response = await requestUrl({
		  url: endpoint,
		  method: 'POST',
		  headers: {
			  'user-agent': 'obsidian.md',
			  ...predefinedHeaders,
			  ...options?.headers
		  },
		  body: requestBody
	  });

	  console.log('POST response', response);
	  return response.json;

  }
}

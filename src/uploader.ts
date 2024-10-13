import LskyUpload from "./lskyUpload";

// Types
import { IUploadPluginSettings, IUploader } from './type';

function Uploader(settings: IUploadPluginSettings): IUploader {
	switch (settings.mode) {
		case 'lsky':
			return new LskyUpload(settings);
		default:
			throw new Error('should not reach here!')
	}
}

export default Uploader;

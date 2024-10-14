import LskyUpload from "./lskyUpload";
import HaloUpload from "./haloUpload";

// Types
import { IUploadPluginSettings, IUploader } from './type';

function Uploader(settings: IUploadPluginSettings): IUploader {
	switch (settings.mode) {
		case 'lsky':
			return new LskyUpload(settings);
		case 'halo':
			return new HaloUpload(settings);
		default:
			throw new Error('should not reach here!')
	}
}

export default Uploader;

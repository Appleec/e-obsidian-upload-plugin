// Uploader
import LskyUpload from "./lsky/lskyUploader";
import HaloUploader from "./halo/haloUploader";
import GithubUploader from "./github/githubUploader";

// Config
import { EUploaderProvider } from "../config";

// Types
import { ISettings, IUploader } from '../type';

function uploaderBuilder(settings: ISettings): IUploader {
	switch (settings.mode) {
		case EUploaderProvider.Lsky:
			return new LskyUpload(settings);
		case EUploaderProvider.Halo:
			return new HaloUploader(settings);
		case EUploaderProvider.Github:
			return new GithubUploader(settings);
		default:
			throw new Error('should not reach here!')
	}
}

export { uploaderBuilder }
export default uploaderBuilder;

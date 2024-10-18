abstract class Uploader {
	abstract upload (file: File): Promise<string>
}

export { Uploader }
export default Uploader;

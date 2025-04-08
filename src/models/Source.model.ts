export interface Source {
	duration: number;
}

export interface FileSource extends Source {
	fileName: string;
}

export interface UrlSource extends Source {
	url: string;
}

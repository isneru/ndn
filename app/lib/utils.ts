export function getFileType(filename: string) {
	const extension = filename.split('.').pop()?.toLowerCase()
	switch (extension) {
		case 'png':
			return { extension, mimeType: 'image/png' }
		case 'jpg':
		case 'jpeg':
			return { extension, mimeType: 'image/jpeg' }
		case 'txt':
			return { extension, mimeType: 'text/plain' }
		case 'json':
			return { extension, mimeType: 'application/json' }
		case 'pdf':
			return { extension, mimeType: 'application/pdf' }
		case 'gif':
			return { extension, mimeType: 'image/gif' }
		case 'mp4':
			return { extension, mimeType: 'video/mp4' }
		case 'wav':
			return { extension, mimeType: 'audio/wav' }
		case 'zip':
			return { extension, mimeType: 'application/zip' }
		case 'svg':
			return { extension, mimeType: 'image/svg+xml' }
		default:
			return { extension, mimeType: 'application/octet-stream' }
	}
}

export function getFileSize(fileData: string | null) {
	if (!fileData) return '0 bytes'

	const bytes = ((fileData.length * 3) / 4) | 0

	if (bytes < 1024) return `${bytes} bytes`
	else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
	else return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
	const byteCharacters = atob(b64Data)
	const byteArrays = []
	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize)
		const byteNumbers = new Array(slice.length)
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i)
		}
		const byteArray = new Uint8Array(byteNumbers)
		byteArrays.push(byteArray)
	}
	return new Blob(byteArrays, { type: contentType })
}

export function decodeBase64(data: string | null): string {
	return data ? atob(data) : ''
}

export function getFileOg(name: string, data: string | null, error: boolean) {
	return error
		? {
				title: 'File does not exist',
				description: 'He probably deleted it.'
			}
		: {
				title: `${name} (${getFileSize(data)})`,
				description: `Download ${name} from neru's Vault`
			}
}

export function stripFileName(name: string) {
	return name.replace(/\s+/g, '_')
}

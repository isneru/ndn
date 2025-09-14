import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import formidable from 'formidable'

export default eventHandler(async event => {
	const form = formidable({ multiples: false })
	const bucketName = useRuntimeConfig().awsBucketName

	try {
		const [fields, files] = await new Promise<
			[formidable.Fields, formidable.Files]
		>((resolve, reject) => {
			form.parse(event.node.req, (err, fields, files) => {
				if (err) reject(err)
				else resolve([fields, files])
			})
		})

		const name = Array.isArray(fields.name)
			? fields.name[0]
			: (fields.name ?? '')
		const type = Array.isArray(fields.type)
			? fields.type[0]
			: (fields.type ?? '')
		const file = files.file as formidable.File | formidable.File[]

		if (!name || !type || !file) {
			return { success: false, error: 'Missing file data' }
		}

		const s3 = new S3Client({
			region: useRuntimeConfig().awsRegion,
			endpoint: useRuntimeConfig().b2Endpoint,
			credentials: {
				accessKeyId: useRuntimeConfig().awsAccessKeyId,
				secretAccessKey: useRuntimeConfig().awsSecretAccessKey
			}
		})

		const fs = await import('fs')
		const fileStream = fs.createReadStream(
			Array.isArray(file) ? file[0].filepath : file.filepath
		)

		await s3.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: name,
				Body: fileStream,
				ContentType: type
			})
		)

		return { success: true, message: `Uploaded ${name} to ${bucketName}`, name }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error)
		}
	}
})

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default eventHandler(async event => {
	const body = await readBody(event)
	const { name, type, data } = body
	if (!name || !type || !data) {
		return { success: false, error: 'Missing file data' }
	}

	const bucketName = useRuntimeConfig().awsBucketName

	try {
		const s3 = new S3Client({
			region: useRuntimeConfig().awsRegion,
			endpoint: useRuntimeConfig().b2Endpoint,
			credentials: {
				accessKeyId: useRuntimeConfig().awsAccessKeyId,
				secretAccessKey: useRuntimeConfig().awsSecretAccessKey
			}
		})

		await s3.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: name,
				Body: Buffer.from(data, 'base64'),
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

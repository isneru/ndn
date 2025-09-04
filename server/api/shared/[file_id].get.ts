import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
	region: useRuntimeConfig().awsRegion,
	endpoint: useRuntimeConfig().b2Endpoint,
	credentials: {
		accessKeyId: useRuntimeConfig().awsAccessKeyId,
		secretAccessKey: useRuntimeConfig().awsSecretAccessKey
	}
})

export default eventHandler(async event => {
	const file_id = event.context.params?.file_id

	let key = file_id
	if (Array.isArray(key)) key = key[0]
	key = String(key)

	try {
		const command = new GetObjectCommand({
			Bucket: useRuntimeConfig().awsBucketName,
			Key: key
		})

		const { Body, ContentRange } = await s3Client.send(command)
		const buffer = await Body?.transformToByteArray()
		const base64 = buffer ? Buffer.from(buffer).toString('base64') : null

		return {
			key,
			range: ContentRange,
			data: base64
		}
	} catch (err: unknown) {
		if (err instanceof NoSuchKey) {
			throw createError({
				statusCode: 404,
				statusMessage: `File ${key} does not exist.`
			})
		}

		throw createError({
			statusCode: 500,
			statusMessage: err instanceof Error ? err.message : String(err)
		})
	}
})

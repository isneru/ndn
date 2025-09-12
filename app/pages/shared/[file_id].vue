<script setup lang="ts">
definePageMeta({ auth: false })

import {
	b64toBlob,
	decodeBase64,
	getFileOg,
	getFileSize,
	getFileType
} from '~/lib/utils'

const { params } = useRoute()

const file_id = params.file_id as string

const {
	data: result,
	error,
	pending
} = await useAsyncData(`file-${file_id}`, () =>
	$fetch(`/api/shared/${file_id}`)
)

const fileName = computed(() => result.value?.key ?? '')
const fileData = computed(() => result.value?.data ?? null)
const fileType = computed(() => getFileType(fileName.value))

function downloadFile() {
	if (!fileData.value) return
	const link = document.createElement('a')
	const blob = b64toBlob(fileData.value, fileType.value.mimeType)
	link.href = URL.createObjectURL(blob)
	link.download = fileName.value
	link.click()
}

const { value: og } = computed(() =>
	getFileOg(fileName.value, fileData.value, !!error.value)
)

useSeoMeta({
	title: og.title,
	ogTitle: og.title,
	description: og.description,
	ogDescription: og.description
})

defineOgImageComponent('Template', {
	title: og.title,
	description: og.description
})

if (error.value) {
	throw createError({
		statusCode: error.value.statusCode || 500,
		statusMessage: error.value.statusMessage || 'Unknown Error'
	})
}
</script>

<template>
	<div class="grid place-items-center">
		<p v-if="pending" class="text-neutral-400">Loading...</p>
		<div
			v-else-if="fileData"
			class="flex flex-col w-full max-w-[60vw] min-w-[360px]">
			<div class="flex gap-4 items-end px-4">
				<p class="font-bold md:text-3xl text-xl max-w-[20ch] truncate">
					{{ fileName }}
				</p>
				<span class="text-neutral-400 text-lg">{{
					getFileSize(fileData)
				}}</span>
			</div>
			<img
				v-if="fileType.mimeType.startsWith('image/')"
				:src="`data:${fileType.mimeType};base64,${fileData}`"
				:alt="fileName"
				class="rounded-lg shadow w-full max-h-[40vh]" />
			<audio
				class="w-full"
				v-if="fileType.mimeType.startsWith('audio/')"
				controls>
				<source :src="`data:${fileType.mimeType};base64,${fileData}`" />
			</audio>
			<video
				class="rounded-lg shadow w-full max-h-[40vh]"
				v-if="fileType.mimeType.startsWith('video/')"
				controls>
				<source :src="`data:${fileType.mimeType};base64,${fileData}`" />
				Your browser does not support the video tag.
			</video>
			<div
				v-else-if="fileType.mimeType === 'text/plain'"
				class="resize-y bg-slate-900 p-4 rounded-lg h-[30vh] max-h-[60vh] overflow-y-auto leading-relaxed text-neutral-200 whitespace-pre-wrap break-words">
				{{ decodeBase64(fileData) }}
			</div>
			<button
				@click="downloadFile"
				class="bg-blue-600 transition-colors text-white mt-6 px-4 py-2 rounded hover:bg-blue-800 cursor-pointer">
				Download file
			</button>
		</div>
	</div>
</template>

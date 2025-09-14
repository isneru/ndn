<script setup lang="ts">
import { stripFileName } from '~/lib/utils'

definePageMeta({ auth: false })

const { status } = useAuth()

const title = `neru's Vault`
const description = `This is where neru uploads his stuff.`

useSeoMeta({
	title,
	description,
	ogTitle: title,
	ogDescription: description
})

defineOgImageComponent('Template', {
	title,
	description
})

import { ref } from 'vue'
const fileName = ref<string>('')
const file = ref<File | null>(null)

function handleFileChange(e: Event) {
	let files: FileList | null = null
	if ('dataTransfer' in e) {
		files = (e as DragEvent).dataTransfer?.files || null
	} else {
		files = (e.target as HTMLInputElement).files || null
	}
	if (files && files.length && files[0]) {
		file.value = files[0]
		fileName.value = files[0].name ?? ''
	}
}
const pending = ref(false)

async function uploadToS3(file: File | null) {
	if (!file) return
	pending.value = true
	try {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('name', stripFileName(file.name))
		formData.append('type', file.type)

		const res = await fetch('/api', {
			method: 'POST',
			body: formData
		})

		if (!res.ok) {
			const text = await res.text()
			throw new Error(`Server error (${res.status}): ${text}`)
		}

		const result = await res.json()
		if (result.success) {
			navigateTo(`/shared/${result.name}`)
		} else {
			alert('Upload failed: ' + (result.error || 'Unknown error'))
		}
	} catch (err: any) {
		alert('Upload error: ' + (err?.message || err))
	} finally {
		pending.value = false
	}
}
</script>

<template>
	<main
		v-if="status === 'authenticated'"
		class="flex items-center justify-center flex-col gap-4">
		<div
			class="border-2 border-dashed border-slate-700 p-10 text-center cursor-pointer w-[40vw] min-w-[360px] space-y-6 rounded-lg"
			@dragover.prevent
			@drop.prevent="handleFileChange">
			<h2 class="text-neutral-200 text-lg">Drag and drop a file here</h2>
			<input
				type="file"
				ref="fileInput"
				id="fileInput"
				class="hidden"
				@change="handleFileChange" />
			<label
				for="fileInput"
				class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
				Or select a file
			</label>
			<p v-if="fileName" class="text-neutral-400 mt-4">
				Selected file: {{ fileName }}
			</p>
		</div>
		<button
			class="disabled:cursor-not-allowed rounded-lg bg-blue-600 px-4 w-full py-2 hover:bg-blue-800 transition-colors disabled:bg-blue-800"
			:disabled="!fileName || pending"
			@click="uploadToS3(file)">
			{{ pending ? 'Uploading...' : 'Upload File' }}
		</button>
	</main>
	<main v-else class="flex items-center justify-center flex-col gap-4">
		<p class="text-neutral-300 text-center md:text-xl text-balance px-4">
			Contact the owner to gain access to upload files.
		</p>
	</main>
	<AuthCTA />
</template>

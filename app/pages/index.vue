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

const fileName = ref('')
const file = ref<File | null>(null)
const pending = ref(false)

async function uploadToS3(file: File | null) {
	if (!file) return
	const reader = new FileReader()
	reader.onload = async () => {
		const base64 = (reader.result as string).split(',')[1]
		try {
			pending.value = true
			const res = await fetch('/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: stripFileName(file.name),
					type: file.type,
					data: base64
				})
			})
			const result = await res.json().finally(() => {
				pending.value = false
			})
			if (result.success) {
				navigateTo(`/shared/${result.name}`)
			} else {
				alert('Upload failed: ' + result.error)
			}
		} catch (err) {
			alert('Upload error: ' + err)
		}
	}
	reader.readAsDataURL(file)
}

function handleFileChange(e: any) {
	const files = e.target.files || e.dataTransfer?.files
	if (files && files.length) {
		file.value = files[0]
		fileName.value = files[0].name
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

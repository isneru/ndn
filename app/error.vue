<script setup lang="ts">
definePageMeta({ auth: false })
import type { NuxtError } from '#app'

const props = defineProps({
	error: Object as () => NuxtError
})
</script>

<template>
	<div class="flex flex-col items-center justify-center gap-2">
		<h1 class="font-mono text-4xl md:text-6xl font-bold">
			{{ error?.statusCode }}
		</h1>
		<p class="text-xl md:text-3xl">{{ error?.statusMessage }}</p>
		<NuxtLink
			class="text-neutral-300 font-medium hover:decoration-blue-500 hover:text-neutral-200 transition-colors md:text-lg underline decoration-2 underline-offset-2 mt-4"
			to="/"
			>Go back home</NuxtLink
		>
	</div>
</template>

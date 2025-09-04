<script lang="ts" setup>
type Props = {
	title: string
	description: string
}

const { title, description } = defineProps<Props>()
</script>

<template>
	<div class="w-full h-full bg-slate-950">
		<div class="relative z-20 flex flex-col w-full h-full px-16 py-12">
			<div class="flex gap-4 mb-8">
				<div class="w-24 h-3 bg-purple-500 rounded-full"></div>
				<div class="w-12 h-2 bg-blue-600 rounded-full"></div>
				<div class="w-4 h-1 bg-purple-500 rounded-full"></div>
			</div>

			<div class="flex-1 flex flex-col justify-center max-w-4xl">
				<h1
					class="text-6xl font-bold leading-tight text-white mb-6 text-balance">
					{{ title }}
				</h1>

				<p
					class="text-3xl font-medium text-blue-200 leading-relaxed max-w-3xl text-pretty">
					{{ description }}
				</p>
			</div>

			<div class="ml-auto flex items-center gap-2">
				<div class="w-2 h-2 bg-purple-500 rounded-full"></div>
				<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
				<div class="w-2 h-2 bg-purple-500 rounded-full"></div>
			</div>
		</div>
	</div>
</template>

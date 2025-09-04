<script setup lang="ts">
const { signIn, signOut, status } = useAuth()
</script>

<template>
	<button
		v-if="status === 'unauthenticated'"
		class="bg-slate-800 px-4 py-2 rounded-lg text-sm hover:bg-slate-900 transition-colors cursor-pointer absolute bottom-4 right-4"
		@click="signIn('github')">
		Sign In
	</button>
	<button
		v-else
		:disabled="status === 'loading'"
		class="bg-slate-800 px-4 py-2 rounded-lg text-sm hover:bg-slate-900 transition-colors cursor-pointer absolute bottom-4 right-4"
		@click="signOut()">
		Sign Out
	</button>
</template>

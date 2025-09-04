import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		authOrigin: '',
		authSecret: process.env.NUXT_AUTH_SECRET,
		githubClientId: process.env.NUXT_GITHUB_CLIENT_ID,
		githubClientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
		awsAccessKeyId: process.env.NUXT_AWS_ACCESS_KEY_ID,
		awsSecretAccessKey: process.env.NUXT_AWS_SECRET_ACCESS_KEY,
		awsBucketName: process.env.NUXT_AWS_BUCKET_NAME,
		awsRegion: process.env.NUXT_AWS_REGION,
		b2Endpoint: process.env.NUXT_B2_ENDPOINT
	},
	compatibilityDate: '2025-07-15',
	vite: {
		plugins: [tailwindcss()]
	},
	css: ['~/styles/main.css'],
	devtools: { enabled: true },
	modules: ['@sidebase/nuxt-auth', 'nuxt-og-image'],
	site: {
		url: 'https://cdn.diogo.wtf',
		name: `neru's Vault`
	},
	auth: {
		baseURL: process.env.NUXT_AUTH_ORIGIN,
		isEnabled: true,
		disableServerSideAuth: false,
		globalAppMiddleware: true,
		originEnvKey: 'NUXT_AUTH_ORIGIN',
		provider: {
			type: 'authjs',
			trustHost: true,
			defaultProvider: 'github',
			addDefaultCallbackUrl: true
		},
		sessionRefresh: {
			enablePeriodically: true,
			enableOnWindowFocus: true
		}
	},
	app: {
		head: {
			title: `neru's Vault`,
			htmlAttrs: {
				lang: 'en'
			}
		}
	}
})

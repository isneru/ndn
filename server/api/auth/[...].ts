import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
	secret: useRuntimeConfig().authSecret,
	providers: [
		// @ts-expect-error Use .default here for it to work during SSR.
		GithubProvider.default({
			clientId: useRuntimeConfig().githubClientId,
			clientSecret: useRuntimeConfig().githubClientSecret
		})
	],
	callbacks: {
		signIn({ user }) {
			const isAllowedToSignIn = user.email === 'diogoclanogueira@gmail.com'
			return isAllowedToSignIn
		},
		async redirect({ url, baseUrl }) {
			return baseUrl
		}
	}
})

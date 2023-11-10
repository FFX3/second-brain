import { redirect } from '@sveltejs/kit'

export const load = async ({ url, locals: { getSession } }) => {
    const session = await getSession()

    const publicRouteWhiteList = ['/auth/sign-in', '/auth/sign-up']

    if (!session && !publicRouteWhiteList.includes(url.pathname)) {
        console.log('redirecting')
        throw redirect(303, '/auth/sign-in')
    }
    return {
        session,
        path: url.pathname
    }
}

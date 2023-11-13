import { redirect } from '@sveltejs/kit'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const actions = {
    signout: async ({ locals: { supabase, getSession } }) => {
        const session = await getSession()
        if (session) {
            await supabase.auth.signOut()
            throw redirect(303, '/auth/sign-in')
        }
    },

    embed: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()

        const schema = zfd.formData({
            embed: z.string()
        })

        const result = schema.safeParse(formData)

        if(!result.success){ 
            console.error(result.error)
            return 
        }

        const { data, error } = await  supabase.functions.invoke('embed', {
            body: {
                input: result.data.embed
            }
        })

        if(error){console.error(error)}

        return {
            data, error
        }
    },
}

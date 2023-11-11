import { z } from 'zod'
import { zfd } from 'zod-form-data'

type SignInResponse = {
    errors: string[],
    action_id: 'sign_in'
}

type Response = 
    SignInResponse
    | undefined

const schema = zfd.formData({
    email: z.string().email(),
    password: z.string(),
})

export const actions = {
    sign_in: async ({request, locals: { supabase } }): Promise<Response> => {
        const formData = await request.formData()

        const result = schema.safeParse(formData)

        if(!result.success){
            return { 
                action_id: 'sign_in',
                errors: result.error.issues.map((issue)=>{
                    return issue.message
                })
            }
        }

        const { email, password } = result.data

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if(error){
            return { 
                action_id: 'sign_in',
                errors: [error.message]
            }
        }
    },

}

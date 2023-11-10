import { z } from 'zod'
import { zfd } from 'zod-form-data'

export type SignInResponse = {
    errors: string[]
}|undefined

const schema = zfd.formData({
    email: z.string().email(),
    password: z.string(),
})

export const actions = {
    sign_in: async ({request, locals: { supabase } }): Promise<SignInResponse> => {
        const formData = await request.formData()

        const result = schema.safeParse(formData)

        if(!result.success){
            return { 
                errors: result.error.issues.map((issue)=>{
                    return issue.message
                })
            }
        }

        const { email, password } = result.data

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if(error){
            return { errors: [error.message] }
        }
    },
}

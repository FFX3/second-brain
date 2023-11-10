import { z } from 'zod'
import { zfd } from 'zod-form-data'

export type SignUpResponse = {
    errors: string[]
}|undefined

const schema = zfd.formData({
    email: z.string().email(),
    password: z.string(),
})

export const actions = {
    sign_up: async ({request, locals: { supabase } }): Promise<SignUpResponse> => {
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

        const { error } = await supabase.auth.signUp({ email, password })
        if(error){
            return { errors: [error.message] }
        }
    },
}

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

import type { Database } from '../../../types/database.types.ts'

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

const pipe = await pipeline(
  'feature-extraction',
  'Supabase/gte-small',
);

const schema = z.object({
    input: z.string(),
})

serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
  )
  // Extract input string from JSON body
  
  const result = schema.safeParse(await req.json())

  if(!result.success){
      console.error(result.error)
      return new Response(
        JSON.stringify({ 'error': 'invalid request' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
  }

  const { input } = result.data

  // Generate the embedding from the user input
  const output = await pipe(input, {
    pooling: 'mean',
    normalize: true,
  });

  // Extract the embedding output
  const embedding = Array.from(output.data) as number[]
  
  const { data, error } = await supabase.from('documents').insert({
      content: input,
      metadata: {},
      embedding,
  }).select().single()

  if(error){
      console.error(error)
      return new Response(
        JSON.stringify({ 'error': 'couldn\'t store embedding' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
  }


  // Return the embedding
  return new Response(
    JSON.stringify({ 
        embedding_id: data.id
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});

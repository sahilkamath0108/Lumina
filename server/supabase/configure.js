// import { createClient } from '@supabase/supabase-js'

// // Create a single supabase client for interacting with your database
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// export default supabase;

// src/supabase/serviceClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase server ENV keys')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
})

export default supabase

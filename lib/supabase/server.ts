import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder'

    return createSupabaseClient(url, key)
}

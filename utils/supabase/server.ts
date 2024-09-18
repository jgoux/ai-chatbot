import { Database } from '@/lib/types'
import { createClient as createSupabaseClient } from '@supabase/auth/next/server'

export const createClient = () => createSupabaseClient<Database>()

import { Database } from '@/lib/types'
import { createClient as createSupabaseClient } from '@supabase/auth/next/client'

export const createClient = () => createSupabaseClient<Database>()

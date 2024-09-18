import { Database } from '@/lib/types'
import { createClient as createSupabaseClient } from '@supabase/nextjs/server'

export const createClient = () => createSupabaseClient<Database>()

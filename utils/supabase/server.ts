import { Database } from '@/lib/types'
import { createClient as createSupabaseClient } from '@supabase-labs/nextjs/server'

export const createClient = () => createSupabaseClient<Database>()

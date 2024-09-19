import { Database } from '@/lib/types'
import { createClient as createSupabaseClient } from '@supabase-labs/nextjs/client'

export const createClient = () => createSupabaseClient<Database>()

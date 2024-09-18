import { Database } from '@/lib/types'
import { createClient as createSupabaseClient } from '@supabase/nextjs/client'

export const createClient = () => createSupabaseClient<Database>()

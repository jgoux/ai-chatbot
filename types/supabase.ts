import { Chat } from '@/lib/types'
import type { Database as SupabaseDatabase } from './database'
import type { MergeDeep } from 'type-fest'

// We need to have a better way to define json/jsonb column types
export type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Tables: {
        chats: {
          Row: {
            payload: Chat | null
          }
          Insert: {
            payload?: Chat | null
          }
          Update: {
            payload?: Chat | null
          }
        }
      }
    }
  }
>

declare module '@supabase-labs/nextjs/server' {
  interface Register {
    database: Database
  }
}
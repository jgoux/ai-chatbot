'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { createClient } from '@supabase-labs/nextjs/server'

export async function getChats(userId?: string | null) {
  const session = await auth()

  if (!userId) {
    return []
  }

  if (userId !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const supabase = createClient()

    const { data } = await supabase
      .from('chats')
      .select('payload')
      .order('payload->createdAt', { ascending: false })
      .eq('user_id', userId)
      .throwOnError()

    return data?.map(chat => chat.payload).filter(chat => chat !== null) ?? []
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const session = await auth()

  if (userId !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const supabase = createClient()

  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()

  return data?.payload ?? null
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const supabase = createClient()
    await supabase.from('chats').delete().eq('id', id).throwOnError()
  } catch (_) {
    return {
      error: 'Unauthorized'
    }
  }

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const supabase = createClient()
    await supabase
      .from('chats')
      .delete()
      .eq('user_id', session.user.id)
      .throwOnError()
  } catch (_) {
    return {
      error: 'Unauthorized'
    }
  }

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .not('payload->sharePath', 'is', null)
    .maybeSingle()

  return data?.payload ?? null
}

export async function shareChat(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const supabase = createClient()

  const { data } = await supabase
    .from('chats')
    .select('payload')
    .eq('id', id)
    .maybeSingle()

  const chat = data?.payload ?? null

  if (!chat || chat.userId !== session.user.id) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await supabase
    .from('chats')
    .update({ payload })
    .eq('id', chat.id)
    .throwOnError()

  return payload
}

export async function saveChat(chat: Chat) {
  const session = await auth()

  if (session && session.user) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('chats').upsert(
        {
          id: chat.id,
          user_id: chat.userId,
          payload: chat
        },
        { onConflict: 'id' }
      )
      if (error) {
        console.error('Error saving chat:', error)
        return { error: error.message }
      }
      return { success: true }
    } catch (err) {
      console.error('Unexpected error saving chat:', err)
      return { error: 'An unexpected error occurred' }
    }
  } else {
    console.warn('Attempted to save chat without an active session')
    return { error: 'No active session' }
  }
}

// not in use?
// export async function refreshHistory(path: string) {
//   redirect(path)
// }

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}

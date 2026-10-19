import {refreshAccessToken} from '@/app/function/refreshAccessToken'

const BLOCK_URL = ' https://animehub-3-kbnb.onrender.com/blocked-users/'

// The blocked user's id is sent in the body; GET requests must not have one.
const authFetch = async (method: string, userId?: string | number) => {
    const request = () =>
        fetch(BLOCK_URL, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: userId === undefined ? undefined : JSON.stringify({ blocked_id: userId })
        })

    let response = await request()
    if (response.status === 401) {
        await refreshAccessToken()
        response = await request()
    }
    return response
}

export const blockUser = async (userId: string | number) => {
    const response = await authFetch('POST', userId)
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to block user')
    }
    return data
}

export const unblockUser = async (userId: string | number) => {
    const response = await authFetch('DELETE', userId)
    // 404 means the user was not blocked
    if (!response.ok && response.status !== 404) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.detail || data.error || 'Failed to unblock user')
    }
}
// Assumes GET /blocked-users/ lists the users I have blocked.
export const isUserBlocked = async (userId: string | number): Promise<boolean> => {
    const response = await authFetch('GET')
    if (!response.ok) {
        throw new Error(`GET /blocked-users/ failed with ${response.status}`)
    }
    const data = await response.json()
    console.log('blocked-users response:', data)
    const list = Array.isArray(data) ? data : data?.results ?? []
    const idOf = (v: unknown): string =>
        v !== null && typeof v === 'object' ? String((v as { id?: unknown }).id) : String(v)
    return list.some((b: Record<string, unknown>) =>
        ['blocked_id', 'blocked', 'blocked_user', 'blocked_user_id'].some(
            (k) => b[k] !== undefined && idOf(b[k]) === String(userId),
        ),
    )
}


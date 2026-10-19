import { refreshAccessToken } from '@/app/function/refreshAccessToken';

export const createChat = async (participantId: number | string) => {
    const send = (access: string | null) =>
        fetch(` https://animehub-3-kbnb.onrender.com/chats/start/${participantId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`,
            },
            body: JSON.stringify({ participant_id: Number(participantId) }),
        });

    let response = await send(localStorage.getItem('accessToken'));
    if (response.status === 401) {
        response = await send(await refreshAccessToken());
    }
    if (!response.ok) {
        throw new Error('Failed to create chat');
    }
    return response.json();
};

import { refreshAccessToken } from '@/app/function/refreshAccessToken';


export const getChatParticipants = async (roomId: string) => {
    try {
        let access = localStorage.getItem('accessToken');

        let response = await fetch(` https://animehub-3-kbnb.onrender.com/chats/${roomId}/participants/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });
        if (response.status === 401) {
            access = await refreshAccessToken();
            response = await fetch(` https://animehub-3-kbnb.onrender.com/chats/${roomId}/participants/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
        }
        const data = await response.json();
        if(response.ok) {
            console.log(`Fetched participants for room ${roomId}:`, data);
            return data;
        }   
        return null;
    } catch (error) {
        console.error(`Failed to fetch participants for room ${roomId}:`, error);
        return error;
    }
};
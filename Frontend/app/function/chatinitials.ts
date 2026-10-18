import {refreshAccessToken} from '@/app/function/refreshAccessToken';



export  const getchats = async () => {
    try{
        
    let access = localStorage.getItem('accessToken');

    let response = await fetch('http://127.0.0.1:8000/chats/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access}`
        }
    });
    if (response.status === 401) {
        access = await refreshAccessToken();
        response = await fetch('http://127.0.0.1:8000/chats/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });
    }
   const data = await response.json();
   if(response.ok)
       return data;
   
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      return error
  }
  return null;
};


export const getChatMessages = async (roomId: string) => {
   try {
     let access = localStorage.getItem('accessToken');

    let response = await fetch(`http://127.0.0.1:8000/chats/${roomId}/messages/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access}`
        }
    });
    if (response.status === 401) {
        access = await refreshAccessToken();
        response = await fetch(`http://127.0.0.1:8000/chats/${roomId}/messages/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });
    }
    const data = await response.json();
    if(response.ok) {
        console.log(`Fetched messages for room ${roomId}:`, data);
        return data;
    }   
    return null;
   } catch (error) {
     console.error(`Failed to fetch messages for room ${roomId}:`, error);
     return error;
   }
};

export const  deletechatforcurrentuser = async (roomId: string) => {
    try {
        let access = localStorage.getItem('accessToken');

        let response = await fetch(`http://127.0.0.1:8000/chats/${roomId}/messages/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });
        if (response.status === 401) {
            access = await refreshAccessToken();
            response = await fetch(`http://127.0.0.1:8000/chats/${roomId}/messages/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
        }
        // A 204 No Content response has no JSON body
        const data = await response.json().catch(() => null);
        if(response.ok) {
            console.log(`Deleted chat for current user in room ${roomId}:`, data);
            return response;
        }
    } catch (error) {
        console.error(`Failed to delete chat for current user in room ${roomId}:`, error);
        return false;
    }
    return false;
};



export const deleteMessages = async (roomId: string,message_id: string) => {

    try {
        let access = localStorage.getItem('accessToken');

        let response = await fetch(`http://127.0.0.1:8000/chats/${roomId}/messages/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({ message_id })
        });
        if (response.status === 401) {
            access = await refreshAccessToken();
            response = await fetch(`http://127.0.0.1:8000/chats/${roomId}/messages/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                },
                body: JSON.stringify({ message_id })
            });
        }
        const data = await response.json().catch(() => null);
        if(response.ok) {
            console.log(`Deleted message ${message_id} in room ${roomId}:`, data);
            return response ;
        }
    } catch (error) {
        console.error(`Failed to delete message ${message_id} in room ${roomId}:`, error);
        return false;
    }
    return false;
};

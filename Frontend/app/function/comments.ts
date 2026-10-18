
import { refreshAccessToken } from '@/app/function/refreshAccessToken';

 export const fetchComments = async (articleId: string) => {

    try {

        let access = localStorage.getItem('accessToken');
        let response = await fetch(`http://127.0.0.1:8000/comments/${articleId}/`,{


        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    })
    if(response.status===401){
        await refreshAccessToken();
        access = localStorage.getItem('accessToken');
        response = await fetch(`http://127.0.0.1:8000/comments/${articleId}/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });
    }
     const data = await response.json();
     console.log(data);
    return data;
   
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return error;
    }
}


export const postComment = async (articleId: number, comment: string) => {
    try {

        let access = localStorage.getItem('accessToken');
        let response = await fetch(`http://127.0.0.1:8000/comments/${articleId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({content: comment })
        });

        if(response.status===401){
            await refreshAccessToken();
            access = localStorage.getItem('accessToken');
            response = await fetch(`http://127.0.0.1:8000/comments/${articleId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                },
                body: JSON.stringify({content: comment })
            });
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.detail || data?.error || 'Failed to post comment');
        }
        return data;
    } catch (error) {
        console.error("Failed to post comment:", error);
        throw error;
    }
}


export const deleteComment = async (commentId: string | number) => {
    try {
        let access = localStorage.getItem('accessToken');
        let response = await fetch(`http://127.0.0.1:8000/remove-comment/${commentId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });

        if(response.status===401){
            await refreshAccessToken();
            access = localStorage.getItem('accessToken');
            response = await fetch(`http://127.0.0.1:8000/remove-comment/${commentId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.detail || data?.error || 'Failed to delete comment');
        }
        return data;
    } catch (error) {
        console.error("Failed to delete comment:", error);
        throw error;
    }
}
import {refreshAccessToken} from '@/app/function/refreshAccessToken';


export const deletePost = async (postId: number | string) => {

   try{
     let access = localStorage.getItem('AccessToken');

    let response = await fetch(` https://animehub-3-kbnb.onrender.com/delete-post/${postId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401) {
        access = await refreshAccessToken();
        response = await fetch(` https://animehub-3-kbnb.onrender.com/delete-post/${postId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${access}`,
                'Content-Type': 'application/json'
            }
        });
    }
    const data = await response.json();
    if(response.ok){
        console.log(data);
        return data;
    }
   }catch(error){
       console.error("Error deleting post:", error);
   }
   }



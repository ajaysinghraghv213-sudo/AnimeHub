import {refreshAccessToken} from '@/app/function/refreshAccessToken';


export const userPost = async() =>{

   try {
     let access = localStorage.getItem('accessToken');

    let response = await fetch(`http://127.0.0.1:8000/self-posts/`,{


        method : "GET",
        headers: {
            "Authorization": `Bearer ${access}`
        }
    })

    if(response.status === 401){
        await refreshAccessToken();
        access = localStorage.getItem('accessToken');
        response = await fetch(`http://127.0.0.1:8000/self-posts/`,{
            method : "GET",
            headers: {
                "Authorization": `Bearer ${access}`
            }
        });
        
    }
    const data = await response.json();
    if(response.ok){
        console.log(data);
        return data;
    }
   }
   catch (error) {
       console.error(error);
       return error
   }


    
}
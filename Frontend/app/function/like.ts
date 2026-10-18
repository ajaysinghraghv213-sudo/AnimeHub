import { refreshAccessToken } from "./refreshAccessToken";

  
 export const likePost = async (postId: number) => {

   try {
     let access = localStorage.getItem("accessToken");



    let response = await fetch(`http://127.0.0.1:8000/likes/${postId}/`, {


        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access}`
        }

    });
    if (response.status ===401) {
        await refreshAccessToken();
        access = localStorage.getItem("accessToken");
        response = await fetch(`http://127.0.0.1:8000/likes/${postId}/`, {


            method: "POST",
            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${access}`
            }
        });
    }
    const data = await response.json();

    if (!response.ok) throw new Error(data?.detail || data?.error || "Failed to like post");
    return data;
   } catch (error) {
       console.error("Error liking post:", error);
       throw error;
   }
};


export const UnlikePost = async (postId: number) => {
    try {
         let access = localStorage.getItem("accessToken");

    let response = await fetch(`http://127.0.0.1:8000/unlike/${postId}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access}`
        }
    });

    if(response.status === 401) {
        await refreshAccessToken();
        access = localStorage.getItem("accessToken");
        response = await fetch(`http://127.0.0.1:8000/unlike/${postId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            }
        });
    }
    const data = await response.json();

    if (!response.ok) throw new Error(data?.detail || data?.error || "Failed to unlike post");
    return data;
   } catch (error) {
       console.error("Error unliking post:", error);
       throw error;
   }
}
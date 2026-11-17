



export const recentPosts = async () =>{

    try {
        const response = await fetch(' https://matters-jerusalem-capture-fitted.trycloudflare.com/recent-posts/',{

        method : "GET",

        headers : {
            'Content-Type': 'application/json'
        }


    })
    const data = await response.json();
    console.log(data);
    return data;
    } catch (error) {
        console.error("Error fetching recent posts:", error);
        return error 
        
    }
}




export const recentPosts = async () =>{

    try {
        const response = await fetch('http://127.0.0.1:8000/recent-posts/',{

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



export const getFeaturedPosts = async () => {

    try {const response = await fetch(`http://127.0.0.1:8000/featured-posts/`,{


        method : 'GET',

        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    return data;}
    
    catch (error) {

        console.error("Error fetching featured posts:", error);

        return error
    }
};
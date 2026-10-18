


export const getFeaturedPosts = async () => {

    try {const response = await fetch(`https://animehub-2-i11e.onrender.com/featured-posts/`,{


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



export const getFeaturedPosts = async () => {

    try {const response = await fetch(` https://hired-smtp-float-ontario.trycloudflare.com/featured-posts/`,{


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
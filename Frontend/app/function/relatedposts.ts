


export const relatedPosts = async (postId: number) => {
  // Logic to fetch or filter related posts based on the given postId

 try {
     const response = await fetch(` https://hired-smtp-float-ontario.trycloudflare.com/related-posts/${postId}`,{


    method: 'GET'
  });
  return response.json();
 } catch (error) {
   console.error("Error fetching related posts:", error);
   return error;
  
 }
};
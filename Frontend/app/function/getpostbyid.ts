import { getAllPosts } from "./allpost";

export const getPostById = async (id: string | number) => {
    const posts = await getAllPosts();

    if (!Array.isArray(posts)) {
        throw new Error("Failed to fetch posts");
    }

    const post = posts.find((p: any) => String(p.id) === String(id));

    if (!post) {
        throw new Error("Post not found");
    }

    return post;
};

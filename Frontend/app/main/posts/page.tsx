'use client'


import Categories from "@/app/Components/Categories"
import Navbar from "@/app/Components/Navbar"
import PostbyCategory from "@/app/Components/PostbyCategory"
import AllPostsComponent from "@/app/Components/AllPostsComponent"

import {useSelector} from "react-redux";



const PostsPage = () => {

    const posts = useSelector((state:any) => state.postbycategory.posts);
    const categoryId = useSelector((state:any) => state.category.categoryId);
    return (
       <div className="min-h-screen bg-[#0b0d24] pb-12 text-slate-100 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
           

         <Categories />
         {categoryId !== null  ? <PostbyCategory /> : <AllPostsComponent />}
        </div>
    )
}

export default PostsPage
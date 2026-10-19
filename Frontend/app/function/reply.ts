import {refreshAccessToken} from '@/app/function/refreshAccessToken'
type ReplyPayload = {
    comment_id: number,
    content: string
}


export const reply = async ({comment_id, content}: ReplyPayload) => {

    try {
        let access = localStorage.getItem('accessToken')

    let response = await fetch(` https://animehub-3-kbnb.onrender.com/reply/${comment_id}/`,{

        method : "POST",

        headers  : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${access}`
        },
        body: JSON.stringify({content})
    })
    if (response.status === 401) {
        access = await refreshAccessToken()
        response = await fetch(` https://animehub-3-kbnb.onrender.com/reply/${comment_id}/`,{
            method : "POST",
            headers  : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${access}`
            },
            body: JSON.stringify({content})
        })
    }
    
    return response
    } catch (error) {
        console.error("Failed to reply:", error)
        return error
    }
}
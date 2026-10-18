type RegisterProps = {'username': string,'password': string,'email': string,'confirm_password': string,'setError': React.Dispatch<React.SetStateAction<{[key: string]: string}>>};





export const RegisterUser = async({username,email,password,confirm_password,setError}:RegisterProps) =>{

    try {
        const response = await fetch(`http://127.0.0.1:8000/registeration/`,{

        method : "POST",

        headers : {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username,
            email,
            password,
            confirm_password
        })
    })
    const data = await response.json()

    if(!response.ok){
        setError(data?.error || "Registration failed. Please try again.")
        return null
    } 
    if(response.ok){
        console.log(data)
        return data

    }
    } catch (err: any) {
        console.log(err)
        setError(err.message)
        return null

    }
    
}

export const VerifyOTP = async({email,otp}: {email:string,otp:string}) =>{
    try {


        const response = await fetch(`http://127.0.0.1:8000/verify-otp/`,{
            method : "POST",
            headers : {
                "Content-Type":"application/json"
            },

            body:JSON.stringify({email,otp})
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data?.detail || data?.error || 'OTP verification failed');
        }
        return data;

    } 
    catch (err) {
        console.log(err)
        throw err;
    }
}

type loginprops = {
    username_or_email: string,
    password: string,
    setError:React.Dispatch<React.SetStateAction<string | null>>;
   
}


export const LoginUser = async({username_or_email,password,setError }: loginprops) => {
    console.log(username_or_email, password);

    try {
        const response = await fetch(` https://animehub-3-kbnb.onrender.com/login/`,{


        method: 'POST',


        headers: {
            'Content-Type': 'application/json'

        },

        body: JSON.stringify({username_or_email, password}),


        
    });
     const data = await response.json();

     if(!response.ok){
         setError(data.error);
         console.log(data.error);
     }
    if(response.ok){
        setError(null)

        console.log(data)

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('user_id', data.user_id);

        localStorage.setItem('refreshToken', data.refresh);


    }


    return response;
    } catch (error: any) {
        console.error('Login failed:', error);
        setError('something went wrong');
        throw error;
    }
}
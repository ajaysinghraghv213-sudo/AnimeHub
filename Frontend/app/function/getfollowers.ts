import {refreshAccessToken} from '@/app/function/refreshAccessToken';

// Recursively pulls the first message out of a DRF-style error payload (non_field_errors, detail, nested field errors, etc.)
const extractErrorMessage = (data: any): string | null => {
    if (!data || typeof data !== 'object') return null;
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.error === 'string') return data.error;
    if (Array.isArray(data.non_field_errors) && typeof data.non_field_errors[0] === 'string') {
        return data.non_field_errors[0];
    }
    for (const value of Object.values(data)) {
        if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
        if (value && typeof value === 'object') {
            const nested = extractErrorMessage(value);
            if (nested) return nested;
        }
    }
    return null;
};



export const getFollowers = async () => {


    try {

        let access = localStorage.getItem('accessToken');

        let response = await fetch(`http://127.0.0.1:8000/follow/`, {

            method: 'GET',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
        });

        if (response.status === 401) {

            await refreshAccessToken();

            access = localStorage.getItem('accessToken');

            response = await fetch(`http://127.0.0.1:8000/follow/`, {

                method: 'GET',
                headers: {

                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${access}`,
                },
            });
        }

        if (!response.ok) {
            throw new Error('Failed to fetch followers');
        }

        const data = await response.json();
        console.log(data);

        return data;

    } catch (error) {
        
        console.error(error);
        
        throw error;
    }
};

 export const addFollowers = async (followerId: string) => {
   try {
     let access = localStorage.getItem('accessToken');
   

    let response = await fetch(`http://127.0.0.1:8000/otheruserfollow/${followerId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
        },
      
    });

    if (response.status === 401) {
        await refreshAccessToken();
        access = localStorage.getItem('accessToken');
        response = await fetch(`http://127.0.0.1:8000/otheruserfollow/${followerId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
            
        });
    }

    const data = await response.json();

    const errorMessage = extractErrorMessage(data);
    if (!response.ok || errorMessage) {
        throw new Error(errorMessage || 'Failed to add follower');
    }

    return data;
   } catch (error) {
       console.error(error);
       throw error;
   }
};



export const getothersFollowers = async (userId: string) => {
    try {
        let access = localStorage.getItem('accessToken');

        let response = await fetch(`http://127.0.0.1:8000/otheruserfollow/${userId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
        });

        if (response.status === 401) {
            await refreshAccessToken();
            access = localStorage.getItem('accessToken');
            response = await fetch(`http://127.0.0.1:8000/otheruserfollow/${userId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,
                },
            });
        }

        if (!response.ok) {
            throw new Error('Failed to fetch other user followers');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
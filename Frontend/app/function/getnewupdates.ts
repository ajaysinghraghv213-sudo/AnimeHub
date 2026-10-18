

type GetNewUpdatesData = {
    email: string;
};

const GetNewUpdates = async ({ email }: GetNewUpdatesData) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/get-new-updates/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        if (response.status===429){
            throw new Error('Too many requests. Please try again later.');
        }
        if (!response.ok) {
            throw new Error('Failed to get new updates. Please try again.');
        }
        return response.json();
    } catch (error) {
        console.error('Error getting new updates:', error);
        throw error;
    }
};

export default GetNewUpdates;
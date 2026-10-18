
type EmailusData = {
    /* define the structure of your data here */
    name: string;
    email: string;
    subject: string;
    message: string;
};

const Emailus = async ({ name, email, subject, message }: EmailusData) => {
    try {
        
    const response = await fetch('https://animehub-2-i11e.onrender.com/email-us/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
    });
    if (response.status===429){
        throw new Error('Too many requests. Please try again later.');
        
    }
    if (!response.ok) {
        throw new Error('Failed to send email. Please try again.');
    }
    return response.json();

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default Emailus;
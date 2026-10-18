'use client'


import Loading from './loading'
import { useParams, useRouter } from "next/navigation"; 
import OtherProfileView from '@/app/Components/OtherProfileView';
import ProfileViewComponent from '@/app/Components/ProfileViewComponent';
import {useState,useEffect} from 'react';


const ProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [user_id,setUserId] = useState<string | null>(null)

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        setUserId(storedUserId);
    }, []);

    return (
        <>
            {user_id === id ? <ProfileViewComponent /> : 
            <OtherProfileView userId={id} />}
        </>
    );
};

export default ProfilePage;

'use client'
import { useParams } from 'next/navigation';
import React from 'react';

const UserProfile = () => {
    const {username} = useParams()
    return (
        <div>
    this is the profile of        {username}
        </div>
    );
};

export default UserProfile;
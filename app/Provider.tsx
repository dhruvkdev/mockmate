"use client"
import { UserDetailcontext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { createContext } from 'vm';

function Provider({ children }: any) {

    const CreateUser = useMutation(api.users.CreateNewuser);
    const { user } = useUser();
    const [userDetail, setUserDetail]=useState<any>();
    useEffect(() => {
        user && CreateNewUser();
    }, [user])

    const CreateNewUser = async () => {
        const result = await CreateUser({
            name: user?.fullName ?? '',
            email: user?.primaryEmailAddress?.emailAddress ?? '',
            imageUrl: user?.imageUrl ?? ''
        })
        console.log(result);
        setUserDetail(result);
    }
    return (
        <UserDetailcontext.Provider value={{userDetail, setUserDetail}}>
            <div>{children}</div>
        </UserDetailcontext.Provider>
    )
}

export default Provider

export const useUserDetailContext=()=>{
    return createContext(UserDetailcontext);
}
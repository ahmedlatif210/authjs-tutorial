import { UserInfo } from '@/components/user-info';
import { currentUser } from '@/lib/auth'
import React from 'react'

const ServerPage = async () => {

  //we use currentUser which made in lib folder for server components
  //and we use useCurrentUser which is custom hook in hooks folder for client component

  

  const user = await currentUser();
  return (
    <div>

      <UserInfo user={user} label={`💻Server Component`} />
    </div>
  )
}

export default ServerPage

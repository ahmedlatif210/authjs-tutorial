"use client";

import { UserInfo } from "@/components/user-info";
import useCurrentUser from "@/hooks/use-current-user";
import React from "react";

const ClientPage =  () => {
  //we use currentUser which made in lib folder for server components
  //and we use useCurrentUser which is custom hook in hooks folder for client component

  const user =  useCurrentUser();
  return (
    <div>
      <UserInfo user={user} label={`📱Client Component`} />
    </div>
  );
};

export default ClientPage;

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";


//that will keep the data even after leaving the tap but gives error
// const useCurrentUser = () => {
    //   const { data: session, status } = useSession();
    //   const [user, setUser] = useState(session?.user || null);
    
    //   useEffect(() => {
        //     if (status === "authenticated") {
            //       setUser(session?.user);
            //     }
            //   }, [session, status]);
            
            //   return user;
    // };
    // export default useCurrentUser;
    
    
  

const useCurrentUser = () => {

    
    const session= useSession();
    return session.data?.user
};
    export default useCurrentUser;
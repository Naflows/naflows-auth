import axios from "axios";
import { useEffect } from "react";


const Account = () => {
    useEffect(() => {
        const res = axios.get(`${process.env.DUMMY_API_URL_DEV}/get-user-info`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(res);

        
    }, [])
  
    return <div>Account Page</div>;
}


export default Account;
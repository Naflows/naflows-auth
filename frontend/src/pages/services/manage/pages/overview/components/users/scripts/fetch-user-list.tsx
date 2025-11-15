import axios from "axios";
import { useEffect } from "react";
import type { ServiceUser } from "../../../../../../../../types/ServicesForUserProps";


const useFetchUserList = (serviceId: string, setUsers: (users: ServiceUser[]) => void, setLoading: (loading: boolean) => void, setErrorMessage: (message: string) => void) => {
    useEffect(() => {
        const fetchUsers = async () => {
            if (serviceId) {
                axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/users`, {
                    service_id: serviceId
                }, {
                    withCredentials: true
                }).then((response) => {
                    if (response.data.success) {
                        setUsers(response.data.serviceUsers || []);
                    }
                }).catch((error) => {
                    console.error("Error fetching service users:", error);
                    const code = error.response?.data?.code;
                    if (code) {
                        // Handle specific error codes if needed
                        if (code === 403) {
                            setErrorMessage("You do not have permission to view the users of this service.");
                        } else {
                            setErrorMessage(error.response?.data?.message || "An error occurred while fetching service users.");
                        }
                    }
                }).finally(() => {
                    setLoading(false);
                });
            }
        };

        fetchUsers();
    }, [serviceId]);
}

export default useFetchUserList;
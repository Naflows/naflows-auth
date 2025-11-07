import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps";
import type { ServiceOverviewTabs } from "../../types/tabs.type";
import Loader from "../../../../../../../global/components/Loader";
import axios from "axios";

interface ServiceUser {
    id: string;
    username: string;
    email: string;
    profile_picture: string;
    rights: {
        id: string;
        name: string;
        hue: string;
        description: string;
    }[];
}

const ServiceUsers = ({
    service,
    setTab
}: {
    service: ServicesForUserProps | null;
    setTab: (tab: ServiceOverviewTabs) => void;
}) => {

    const [users, setUsers] = useState<ServiceUser[]>([]);

    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (service) {
                axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/users`, {
                    service_id: service.id
                }, {
                    withCredentials: true
                }).then((response) => {
                    if (response.data.success) {
                        setUsers(response.data.data.serviceUsers || []);
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
    }, [service]);


    return (
        <div className="user__body__section">
            <button className="primary-button" onClick={() => {
                setTab("rights");
            }}>
                Manage Rights
            </button>

            <div className="users__list">
                {loading ? (
                    <Loader loading={true} />
                ) : (
                    users.length > 0 ? (
                        users.map((user) => (
                            <div key={user.id} className="user__item">
                                <img src={user.profile_picture} alt={user.username} className="user__item__avatar" />
                                <div className="user__item__info">
                                    <span className="user__item__username">{user.username}</span>
                                    <span className="user__item__email">{user.email}</span>
                                    <div className="user__item__rights">
                                        {user.rights.map((right) => (
                                            <span key={right.id} className="user__item__right" style={{ backgroundColor: `hsl(${right.hue}, 70%, 80%)`, color: `hsl(${right.hue}, 70%, 30%)` }}>
                                                {right.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <span>
                            {errorMessage ? errorMessage : "No users found for this service."}
                        </span>
                    )
                )}
            </div>
        </div>
    )
}

export default ServiceUsers;
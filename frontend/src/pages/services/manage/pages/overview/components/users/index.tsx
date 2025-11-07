import {  useState } from "react";
import type { ServicesForUserProps, ServiceUser } from "../../../../../../../types/ServicesForUserProps";
import type { ServiceOverviewTabs } from "../../types/tabs.type";
import Loader from "../../../../../../../global/components/Loader";
import '../../../../../../../../public/root/pages/services/manage/sub-components/UsersList.scss';
import useFetchUserList from "./scripts/fetch-user-list";
import ListedUser from "./components/user";



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

    useFetchUserList(service ? service.id : "", setUsers, setLoading, setErrorMessage);


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
                            <ListedUser key={user.id} user={user} />
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
import { useEffect, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../types/ServicesForUserProps"
import axios from "axios";
import type { ServiceRights } from "../../../../../../../types/TunnelingTypes";
import { createdAtToAgo } from "../../../../../../account/sub-components/notifications/methods/createdAtToAgo";
import '../../../../../../../../public/root/pages/services/manage/sub-components/Rights.scss';

const hslToRgba = (h: number, s: number, l: number, a: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a_ = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a_ * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `rgba(${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)}, ${a})`;
}

const ServiceUsers = ({
    service
}: {
    service: ServicesForUserProps | null
}) => {

    const [rights, setRights] = useState<ServiceRights[]>([]);
    const [rightsDetailsLimit, setRightsDetailsLimit] = useState(5);

    useEffect(() => {
        async function fetchRights() {
            if (!service) return;
            try {
                await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/rights/get`, {
                    service_id: service.id
                }, {
                    withCredentials: true
                }).then((response) => {
                    console.log("Fetched rights:", response.data.data);
                    setRights(response.data.data.rights);
                });
            } catch (error) {
                console.error("Error fetching rights:", error);
            }
        }

        fetchRights();
    }, [service])

    return (
        <div>

            <div className="rights__container">
                {
                    rights.length === 0 ? (
                        <p>No rights sets found for this service.</p>
                    ) : (
                        rights.map((right: ServiceRights) => {
                            return (
                                <div key={right.id} className="right__card">
                                    <div className="right__card__body">
                                        <div className="right__header">
                                            <div className="right__color" style={{
                                                backgroundColor: hslToRgba(parseInt(right.hue), 70, 50, 1)
                                            }}></div>
                                            <div className="right__info">
                                                <span className="last__updated">Last updated {createdAtToAgo(right.updated_at)}</span>
                                                <h3>{right.name}</h3>
                                                <div className="rights__details">
                                                    {
                                                        right.rights.map((r, i) => {
                                                            if (i < rightsDetailsLimit) {
                                                                return (<span key={r} className="right__tag">{r}</span>)
                                                            } else if (i === rightsDetailsLimit) {
                                                                return (<span key={r} className="right__tag">+{right.rights.length - rightsDetailsLimit} more</span>)
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="right__users">
                                            {
                                                right.usersPerRights && right.usersPerRights.length > 0 ? (
                                                    right.usersPerRights.map((user, i) => {
                                                        if (i < 3) {
                                                            return (
                                                                <div className="user__image__container" key={user.id}>
                                                                    <img src={user.profile_picture || ""} alt={user.username} />
                                                                </div>
                                                            )
                                                        } else if (i === 3) {
                                                            return (
                                                                <div className="user__image__container more__users" key={user.id}>
                                                                    +{right.usersPerRights!.length - 3}
                                                                </div>
                                                            )
                                                        }
                                                    })
                                                ) : (
                                                    <p>No users found for this right.</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}

export default ServiceUsers;
import { hslToRgba } from "../../../../../../../../scripts/styling/hslToRgba"
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes"
import { createdAtToAgo } from "../../../../../../../account/sub-components/notifications/methods/createdAtToAgo"


const ServiceRightsComponent = ({
    rights, rightsDetailsLimit
    
}: {
    rights: ServiceRights[],
    rightsDetailsLimit: number,
}) => {
    return (
        rights.map((right: ServiceRights,i) => {
            return (
                <div key={right.id} className="right__card" style={{
                    animationDelay: `${i * 100}ms`
                }}>
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

export default ServiceRightsComponent;
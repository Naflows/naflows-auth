import { hslToRgba } from "../../../../../../../../../scripts/styling/hslToRgba"
import type { ServicesForUserProps } from "../../../../../../../../../types/ServicesForUserProps"
import type { ServiceRights } from "../../../../../../../../../types/TunnelingTypes"
import { createdAtToAgo } from "../../../../../../../../account/sub-components/notifications/methods/createdAtToAgo"


const ServiceRightsComponent = ({
    service, rights
}: {
    service: ServicesForUserProps | null,
    rights: ServiceRights[]
}) => {



    if (!service) return <></>;

    return (
        <>
            {rights.map((right: ServiceRights, i) => {
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
                                    <div className="right__info__main">
                                        <span className="last__updated">Last updated {createdAtToAgo(right.updated_at)}</span>
                                        <h3>
                                            <span>{right.name}</span>
                                        </h3>
                                    </div>
                                    <div className="rights__details">
                                        <span className="right__tag">{right.rights.length} rights </span>
                                    </div>
                                </div>
                            </div>
                            <div className="right__users">
                                {
                                    right.usersPerRights && right.usersPerRights.length > 0 && (
                                        right.usersPerRights.map((user, i) => {
                                            if (i < 5) {
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
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )

}

export default ServiceRightsComponent;
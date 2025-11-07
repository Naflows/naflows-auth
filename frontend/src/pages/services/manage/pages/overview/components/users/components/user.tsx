import type { ServiceUser } from "../../../../../../../../types/ServicesForUserProps";
import { createdAtToAgo } from "../../../../../../../account/sub-components/notifications/methods/createdAtToAgo";



const ListedUser = ({ user }: { user: ServiceUser }) => {
    return (
        <div key={user.id} className="user__item">
            <div className="user__item__info">
                <img src={user.profile_picture} alt={user.username} className="user__item__avatar" />
                <div className="item__info__header">
                    <span className="user__item__username">{user.username}</span>
                    <span className="user__item__email">{user.email}</span>
                </div>
            </div>
            <div className="user__item__rights">
                {user.rights.map((right) => (
                    <span key={right.id} className="user__item__right" style={{ backgroundColor: `hsl(${right.hue}, 70%, 80%)`, color: `hsl(${right.hue}, 70%, 30%)` }}>
                        {right.name}
                    </span>
                ))}
            </div>
            <div className="user__item__dates">
                <span className="user__item__joined">Joined: {createdAtToAgo(user.joined_on)}</span>
                <span className="user__item__last-updated">Last Updated: {createdAtToAgo(user.last_updated)}</span>
            </div>
        </div>
    )
}

export default ListedUser;


import CopyButton from "../../../../../../../../global/components/CopyButton";
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
                    <span className="user__item__uid">
                        <span className="user__item__id">{user.id}</span>
                        <CopyButton textToCopy={user.id} className="user__item__copy-button" />
                    </span>
                </div>
            </div>
            <div className="user__item__rights">
                {user.rights.map((right) => (
                    <span key={right.id} className="user__item__right" style={{ backgroundColor: `hsl(${right.hue}, 70%, 10%)`, color: `hsl(${right.hue}, 70%, 50%)`, border: `1px solid hsl(${right.hue}, 70%, 30%)` }}>
                        {right.name}
                    </span>
                ))}

                <div className="user__item__right add-button" title="Add Right">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <div className="user__item__dates">
                <span className="user__item__joined">Joined: {createdAtToAgo(user.joined_on)}</span>
                <span className="user__item__last-updated">Last Updated: {createdAtToAgo(user.last_updated)}</span>
            </div>

            <div className="user__actions">
                <button className="user__action__manage secondary-button">Manage</button>
                <button className="user__action__remove tertiary-button danger-button">Expulse</button>
            </div>
        </div>
    )
}

export default ListedUser;


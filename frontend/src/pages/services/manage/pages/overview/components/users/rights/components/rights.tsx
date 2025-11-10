import { useState } from "react"
import type { ServicesForUserProps } from "../../../../../../../../../types/ServicesForUserProps"
import type { ServiceRights } from "../../../../../../../../../types/TunnelingTypes"
import { createdAtToAgo } from "../../../../../../../../account/sub-components/notifications/methods/createdAtToAgo"
import ServiceRightsSmall from "../../components/small-right"
import SaveChanges from "../../../../../components/save"
import { updateRightsList } from "../../scripts/update-rights"




const ServiceSmallComponent = ({
    right,
    i,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    isDragging
}: {
    right: ServiceRights;
    i: number;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragEnd: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, index: number) => void;
    isDragging: boolean;
}) => {
    return (
        <div
            key={right.id}
            className={`right__card ${isDragging ? 'dragging' : ''}`}
            style={{
                animationDelay: `${i * 100}ms`,
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab'
            }}
            draggable
            onDragStart={(e) => onDragStart(e, i)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, i)}
        >
            <div className="right__card__body">
                <div className="right__card__left">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>

                    <div className="right__header">
                        <div className="right__info">
                            <div className="right__info__main">
                                <ServiceRightsSmall
                                    key={right.id}
                                    id={right.id}
                                    name={right.name}
                                    hue={right.hue}
                                />
                                <span className="last__updated">Last updated {createdAtToAgo(right.updated_at)}</span>
                            </div>
                            <div className="rights__details">
                                <span className="right__tag">{right.rights.length} rights </span>
                            </div>
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
}

const ServiceRightsComponent = ({
    service,
    rights,
    onReorder
}: {
    service: ServicesForUserProps | null,
    rights: ServiceRights[],
    onReorder?: (reorderedRights: ServiceRights[]) => void
}) => {
    const [localRights, setLocalRights] = useState<ServiceRights[]>(rights)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

    const [changed, setChanged] = useState(false)

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()

        if (draggedIndex === null || draggedIndex === dropIndex) return

        const newRights = [...localRights]
        const draggedItem = newRights[draggedIndex]

        // Remove from old position
        newRights.splice(draggedIndex, 1)
        // Insert at new position
        newRights.splice(dropIndex, 0, draggedItem)

        // Update order property
        const updatedRights = newRights.map((right, index) => ({
            ...right,
            order: index + 1
        }))

        setLocalRights(updatedRights)

        // Check if there is a change between original rights and updated rights
        const isChanged = rights.some((right, index) => right.id !== updatedRights[index].id)
        setChanged(isChanged)

        setDraggedIndex(null)

        // Call parent callback if provided
        if (onReorder) {
            onReorder(updatedRights)
        }
    }

    if (!service) return <></>

    return (
        <>
            <div style={{
                display: changed ? "block" : "none"
            }}>
                <SaveChanges
                    onChange={() => {
                        // If there is a change in order, update the backend
                        if (changed) {
                            alert("Updating rights order...")
                            updateRightsList(service.id, localRights, "order").then((success) => {
                                if (success) {
                                    setChanged(false)
                                }
                            })
                        }
                    }}
                    appear={changed}
                />
            </div>
            {localRights.map((right: ServiceRights, i) => {
                return (
                    <ServiceSmallComponent
                        key={right.id}
                        right={right}
                        i={i}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        isDragging={draggedIndex === i}
                    />
                )
            })}
        </>
    )
}

export default ServiceRightsComponent

const ServiceRightsSmall = ({ id, name, hue }: { id: string; name: string; hue: string; }) => {
    return (
        <span key={id} className="user__item__right" style={{ backgroundColor: `hsl(${hue}, 70%, 10%)`, color: `hsl(${hue}, 70%, 50%)`, border: `1px solid hsl(${hue}, 70%, 30%)` }}>
            <span>
                {name}
            </span>
        </span>
    )
}

export default ServiceRightsSmall;
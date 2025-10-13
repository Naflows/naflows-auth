

const SmallPageVisual = ({
    title,
    description,
    level,
    link
}: {
    title: string,
    description: string,
    level: "basic" | "intermediate" | "advanced",
    link: string
}) => {
    return (
        <div className="small__page__visual" onClick={() => {
            window.location.href = link;
        }}>
            <div className="small__page__visual__header">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <span className={`level ${level}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
        </div>
    )
}

export default SmallPageVisual;
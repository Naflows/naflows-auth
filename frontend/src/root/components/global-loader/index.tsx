import type React from "react"
import Loader from "../../../global/components/Loader"


const GlobalLoader = ({
    loading = true,
    content
}: {
    loading?: boolean
    content: React.JSX.Element
}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
        }
        }>
            <span className="subtitle" >
                {content}
            </span>
            <Loader loading={loading} />
        </div>
    )
}

export default GlobalLoader
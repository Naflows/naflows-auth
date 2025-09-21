import { useState } from "react";


const GlobalDisclaimer = ({
    title,
    message,
    content,
    allowHidden = false
}: {
    title: string,
    message: string,
    content?: React.ReactNode,
    allowHidden?: boolean
}) => {

    const [hide, setHide] = useState<boolean>(false);

    return (
        <div className="global__nass__disclaimer" style={{ display: hide ? "none" : "flex" }}>
            <div className="global__disclaimer__header">
                <h4>{title}</h4>
                {allowHidden && <div className="global__disclaimer__hide">
                    <button className="tertiary-button " onClick={() => setHide(!hide)}>Ok, got it</button>
                </div>}
            </div>
            <p>{message}</p>

            {content &&
                <div className="global__disclaimer__content">
                    {content}
                </div>}
        </div>
    );
}


export default GlobalDisclaimer;
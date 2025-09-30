import '../../../../../../../public/root/pages/services/components/save-content.scss';


const SaveChanges = ({
    onChange, appear,
    customContent
} : {
    onChange: () => void;
    appear: boolean;
    customContent? : {
        title: string;
        message: string;
        buttonText: string;
    }
}) => {
    return (
        <div className={`save__changes__container ${appear ? "appear" : "hide"}`}>
            <div className="save__changes__container__header">
                <h3 className="save__changes__title">{customContent ? customContent.title : "Unsaved Changes"}</h3>
                <p className="save__changes__message">{customContent ? customContent.message : "You have unsaved changes. Please save them to ensure your updates are applied."}</p>
            </div>
            <button className="primary-button enhanced" onClick={onChange}>
                {customContent ? customContent.buttonText : "Save Changes"}
            </button>
        </div>
    );
}


export default SaveChanges;
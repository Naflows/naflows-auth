import type { ServiceDescriptionProps } from "./ServiceDescription";



const ImageUpload = ({
    serviceDescription,
    setServiceDescription,
    isBanner = false
}: {
    serviceDescription: ServiceDescriptionProps;
    setServiceDescription: React.Dispatch<React.SetStateAction<ServiceDescriptionProps>>;
    isBanner?: boolean;
}) => {
    return (
        <div className={`image__upload__container ${isBanner ? 'banner' : ''}`} onClick={() => {
            const fileInput = document.getElementById(`file-input-${isBanner ? 'banner' : 'profile'}`);
            if (fileInput) {
                fileInput.click();
            }
        }}>
            {serviceDescription && ((serviceDescription.profileImage && !isBanner) || (isBanner && serviceDescription.bannerImage)) && (
                <img src={(
                    (isBanner && serviceDescription.bannerImage) ? serviceDescription.bannerImage :
                        (!isBanner && serviceDescription.profileImage) ?
                            serviceDescription.profileImage : ""
                )} alt="Service Profile" className="image__upload__preview" />
            )}
            <div className={`image__upload__placeholder ${serviceDescription && ((serviceDescription.profileImage != "" && !isBanner) || (isBanner && serviceDescription.bannerImage != "")) ? 'with-image' : ''}`} data-title={`Upload a ${isBanner ? '700x150' : '300x300'} ${isBanner ? 'banner' : 'profile'} image`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>

                <span>{
                    serviceDescription && ((serviceDescription.profileImage != "" && !isBanner) || (isBanner && serviceDescription.bannerImage != "")) ? "Change" : "Upload"
                } {
                        isBanner ? "Banner" : "Profile"
                    } Image ({isBanner ? "700x150" : "300x300"})</span>
            </div>
            <input type="file" id={`file-input-${isBanner ? 'banner' : 'profile'}`} accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (setServiceDescription) {
                            if (isBanner) {
                                setServiceDescription({ ...serviceDescription, bannerImage: reader.result as string });
                            } else {
                                setServiceDescription({ ...serviceDescription, profileImage: reader.result as string });
                            }
                        }
                    }
                    reader.readAsDataURL(file);
                }
            }} />
        </div>
    )
}

export default ImageUpload;
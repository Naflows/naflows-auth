import { useEffect, useState } from "react";
import type { ServiceDescriptionProps } from "../service-details";

const onFileInputClick = (isBanner: boolean) => {
    const fileInput = document.getElementById(`file-input-${isBanner ? 'banner' : 'profile'}`);
    if (fileInput) {
        fileInput.click();
    }
}

const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isBanner: boolean,
    serviceDescription: ServiceDescriptionProps,
    setServiceDescription: React.Dispatch<React.SetStateAction<ServiceDescriptionProps>>
) => {
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
            } else {
                console.error("setServiceDescription is undefined");
            }
        }
        reader.readAsDataURL(file);
    }
}


const ImageUpload = ({
    serviceDescription,
    setServiceDescription,
    isBanner = false
}: {
    serviceDescription: ServiceDescriptionProps;
    setServiceDescription: React.Dispatch<React.SetStateAction<ServiceDescriptionProps>>;
    isBanner?: boolean;
}) => {

    const [imageSet, setImageSet] = useState<boolean>(false);
    const [image, setImage] = useState<string>("");

    const [classType, setClassType] = useState<string>("");
    const [typeSize, setTypeSize] = useState<string>("");

    useEffect(() => {
        if (serviceDescription) {
            if (isBanner) {
                setImageSet(serviceDescription.bannerImage != "");
                setImage(serviceDescription.bannerImage || "");
            } else {
                setImageSet(serviceDescription.profileImage != "");
                setImage(serviceDescription.profileImage || "");
            }

            setClassType(isBanner ? "banner" : "profile");
            setTypeSize(isBanner ? "700x150" : "300x300");
        }
    }, [serviceDescription])


    return (
        <div className={`image__upload__container ${classType}`} onClick={() => onFileInputClick(isBanner)}>


            {imageSet && (
                <img src={image} alt="Service Profile" className="image__upload__preview" />
            )}
            <div className={`image__upload__placeholder ${imageSet ? 'with-image' : ''}`} data-title={`Upload a ${typeSize} ${classType} image`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>

                <span>{
                    imageSet ? "Change" : "Upload"
                } {
                        classType.charAt(0).toUpperCase() + classType.slice(1)
                    } Image ({typeSize})</span>
            </div>
            <input 
                type="file" 
                id={`file-input-${classType}`} 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => {
                    onFileChange(e, isBanner, serviceDescription, setServiceDescription);
                }
            } />
        </div>
    )
}

export default ImageUpload;
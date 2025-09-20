import { useEffect, useState } from "react";
import Input from "../../../../global/components/Input";
import axios from "axios";
import Textarea from "../../../../global/components/Textarea";
import ImageUpload from "./ImageUpload";

export interface ServiceDescriptionProps {
    name: string;
    description: string;
    profileImage: string;
    allow_public_visibility: boolean;
}


const CreateServiceDescription = ({
    serviceDescription,
    setServiceDescription
}: {
    serviceDescription: ServiceDescriptionProps | null;
    setServiceDescription: React.Dispatch<React.SetStateAction<ServiceDescriptionProps | null>>;
}) => {

    const [serviceID, setServiceID] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${process.env.DUMMY_API_URL_DEV}/public/generate-api-id`);
                console.log("Generated Service ID:", res.data);
                setServiceID(res.data.data.key);
            } catch (error) {
                console.error("Error fetching service ID:", error);
            }
        })();
    }, []);

    return (
        <div className="services__creation__form">
            <div className="services__creation__header">
                <h3>Service Description</h3>
                <p>
                    These informations will help users understand the purpose and functionality of your service and enforce their trust when connecting their Naflows account to it. You can always update these details later.
                </p>
            </div>

            <div className="form">
                <div className="form-content two-columns" style={{
                    alignItems: "center",
                    gap: "50px"
                }}>
                    <ImageUpload
                        serviceDescription={serviceDescription}
                        setServiceDescription={setServiceDescription}
                    />
                    <div className="inputs-container">
                        <div className="global__input__container two-columns">
                            <Input
                                label="Service Name"
                                type="text"
                                required={true}
                                editMode={true}
                                name="service-name"
                                value={serviceDescription ? serviceDescription.name : ""}
                                autoComplete={false}
                            />
                            <Input
                                label="Service Id"
                                type="text"
                                required={true}
                                editMode={false}
                                name="service-id"
                                allowCopy={true}
                                value={serviceID}
                                fitContent={true}
                            />
                        </div>
                        <div className="global__input">
                            <Textarea
                                label="Service Description"
                                name="service-description"
                                required={true}
                                maxCharacters={500}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateServiceDescription;
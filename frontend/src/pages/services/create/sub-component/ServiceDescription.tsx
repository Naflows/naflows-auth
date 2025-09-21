import { useEffect, useState } from "react";
import Input from "../../../../global/components/Input";
import axios from "axios";
import Textarea from "../../../../global/components/Textarea";
import ImageUpload from "./ImageUpload";
import Switch from "../../../../global/components/Switch";

export interface ServiceDescriptionProps {
    name: string;
    description: string;
    profileImage: string;
    allow_public_visibility: boolean;
    bannerImage? : string;
}


const CreateServiceDescription = ({
    serviceDescription,
    setServiceDescription
}: {
    serviceDescription: ServiceDescriptionProps;
    setServiceDescription: React.Dispatch<React.SetStateAction<ServiceDescriptionProps>>;
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

    useEffect(() => {
        setServiceDescription({
            ...serviceDescription,
            name: serviceDescription ? serviceDescription.name : "",
        });
    }, [serviceID]);

    return (
        <div className="services__creation__form">
            <div className="services__creation__header">
                <h3>Service Description</h3>
                <p>
                    These informations will help users understand the purpose and functionality of your service and enforce their trust when connecting their Naflows account to it. You can always update these details later.
                </p>
            </div>

            <div className="form">
                <div className="banner__container">
                    <ImageUpload
                        serviceDescription={serviceDescription}
                        setServiceDescription={setServiceDescription}
                        isBanner={true}
                    />

                </div>
                <div className="inputs-container two-rows" style={{
                    gap: "20px",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                }}>
                    <div className="inputs-container  two-columns" style={{
                        alignItems: "start",
                        gap: "50px"
                    }}>
                        <ImageUpload
                            serviceDescription={serviceDescription}
                            setServiceDescription={setServiceDescription}
                            isBanner={false}
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
                                    onChange={(value) => {
                                        if (value != serviceDescription.name) {
                                            setServiceDescription({ ...serviceDescription, name: value.toString().slice(0, 100)});
                                        }
                                    }}
                                    maxLength={100}
                                    maxChar={100}
                                    displayMaxChar={true}
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
                                    autoComplete={false}
                                />
                            </div>
                            <div className="global__input">
                                <Textarea
                                    label="Service Description"
                                    name="service-description"
                                    required={true}
                                    maxCharacters={500}
                                    onChange={(e) => {
                                        if (e.target.value != serviceDescription.description) {
                                            setServiceDescription({ ...serviceDescription, description: e.target.value });
                                        }
                                    }}
                                    value={serviceDescription ? serviceDescription.description : ""}
                                    minHeight={200}
                                />
                            </div>
                        </div>
                    </div>
                    <Switch
                        label="Allow Public Visibility"
                        checked={serviceDescription ? serviceDescription.allow_public_visibility : false}
                        onChange={(checked) => {
                            if (checked != serviceDescription.allow_public_visibility) {
                                setServiceDescription({ ...serviceDescription, allow_public_visibility: checked });
                            }
                        }}
                        description="If enabled, your service will be listed publicly in the Naflows Services Directory, and anyone will be able to connect to it. If disabled, only users you invite to your service will be able to connect."
                    />
                </div>
            </div>
        </div>
    )
}

export default CreateServiceDescription;
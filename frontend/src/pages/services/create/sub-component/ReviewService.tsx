import { PaymentElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";


const stripePromise = loadStripe(process.env.STRIPE_API_PUBLIC_KEY!);




const ReviewService = () => {


    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        (async () => {
            const res = await axios.post(`${process.env.DUMMY_API_URL_DEV}/secure/payement/stripe-pk`, {});
            console.log(res.data.data.stripe_pk);
            setClientSecret(res.data.data.stripe_pk);
        })();
    }, [])




    return (
        <div className="nass_payement_details">
            <div className="services__creation__header">
                <h3>Payment Details</h3>
                <p>
                    Provide your payment information to complete the service creation process. This information will be used for billing purposes and to ensure uninterrupted service delivery. You can update your payment details at any time in your account settings.
                </p>
            </div>
            <div className="form">
                <div className="form__part">
                    <div className="form__part__header">
                        <h4>Payment Information</h4>
                    </div>
                    {clientSecret && (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret: clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                },
                            }}
                        >
                            <form>
                                <PaymentElement options={{ layout: "tabs" }} />
                                <button className="nass__btn nass__btn--primary" style={{ marginTop: "20px" }} type="submit">Pay Now</button>
                            </form>
                        </Elements>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReviewService;
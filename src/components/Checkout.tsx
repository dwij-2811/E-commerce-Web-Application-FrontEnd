import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";

const Checkout = () => {
  const stripePromise = loadStripe("pk_test_51IftnpK3TGPiGYDzkJ5pwr0VWePwBL8lczDmCT6TQllv6RImTRLyILcoGucaEisMiJuICuoTZVbZeNBOPR10TU8v002wM40oc1");
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
};

export default Checkout;

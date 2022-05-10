import { CheckOutlined, DollarOutlined } from "@ant-design/icons";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createPaymentIntent } from "../functions/stripe";
import { createOrder, emptyUserCart } from "../functions/user";
import Laptop from "../images/apple.jpg";

const StripeCheckout = () => {
  const { user, coupon } = useSelector((state) => ({ ...state }));
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  //API render for stripe
  useEffect(() => {
    createPaymentIntent(user.token, coupon)
      .then((res) => {
        setClientSecret(res.data.clientSecret);

        //Additional response received on successful payment
        setCartTotal(res.data.cartTotal);
        setTotalAfterDiscount(res.data.totalAfterDiscount);
        setPayable(res.data.payable);
      })

      .catch((error) => {
        console.log(error);
      });
  }, [user.token, coupon]);

  //Handler submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment Failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      console.log(JSON.stringify(payload, null, 4));
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          if (typeof window != "undefined") {
            localStorage.removeItem("cart");
          }
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          emptyUserCart(user.token);
        }
      });
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };
  //Handle change for error message
  const handleChange = async (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  //Style cart
  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  return (
    <>
      {!succeeded && (
        <div className="text-center">
          {coupon && totalAfterDiscount !== undefined ? (
            <p className="alert alert-success">{`Total after discount: $${totalAfterDiscount}`}</p>
          ) : (
            <p className="alert alert-danger">No coupon applied</p>
          )}
        </div>
      )}

      <div className="text-center pb-5">
        <Card
          cover={
            <img
              src={Laptop}
              style={{
                height: "200px",
                objectFit: "cover",
                marginBottom: "-50px",
              }}
              alt="Img not found..."
            />
          }
          actions={[
            <>
              <DollarOutlined className="text-info" /> <br /> Total : $
              {cartTotal}
            </>,
            <>
              <CheckOutlined className="text-info" /> <br /> Total payable: $
              {(payable / 100).toFixed(2)}
            </>,
          ]}
        />
      </div>
      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? (
              <div className="spinner" id="spinner "></div>
            ) : (
              "Pay Now"
            )}
          </span>
        </button>
        <br />
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        <br />
        <p
          className={
            succeeded
              ? "result-message text-center"
              : "result-message hiddentext-center"
          }
        >
          Payment Successful.{" "}
          <Link to="/user/history">See it in your purchase history.</Link>
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;

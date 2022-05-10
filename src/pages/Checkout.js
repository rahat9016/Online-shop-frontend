import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  applyCoupon,
  createCashOrderForUser,
  emptyUserCart,
  getUserCart,
  saveUserAddress,
} from "../functions/user";
const Checkout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user.token]);

  const emptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    //remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("Cart is empty. Continue Shopping");
    });
  };
  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address Save!");
      }
    });
  };
  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} required />
      <br />
      <button
        className="btn btn-primary mt-2"
        onClick={saveAddressToDb}
        disabled={!address}
      >
        Save
      </button>
    </>
  );
  const showProducts = () => (
    <>
      {products.map((p, i) => {
        return (
          <div key={i}>
            <p>
              {p.product.title} ({p.color}) x ({p.count}) ={" "}
              {p.product.price * p.count}
            </p>
          </div>
        );
      })}
    </>
  );
  const applyDiscountCoupon = () => {
    applyCoupon(user.token, coupon).then((res) => {
      console.log(res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }
      if (res.data.error) {
        console.log(res.data.error);
        setDiscountError(res.data.error);
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };
  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        value={coupon}
        text="text"
        className="form-control"
      />
      <br />
      <button onClick={applyDiscountCoupon} className="btn btn-primary">
        Apply
      </button>
    </>
  );
  //Cash on delivery
  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
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
        dispatch({
          type: "COD",
          payload: false,
        });
        emptyUserCart(user.token);
        //redirect
        setTimeout(() => {
          history.push("/user/history");
        }, 1000);
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="p-3">
          <h4>Delivery Address</h4>
          <br />
          <br />
          {showAddress()}
          <br />
          <h4>Got Coupon?</h4>
          <br />
          {showApplyCoupon()}
          <br />
          {discountError && (
            <p className="bg-danger p-2 mt-1 text-white">{discountError}</p>
          )}
        </div>
      </div>
      <div className="col-md-6">
        <h4>Order summery</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {showProducts()}
        <hr />
        <p>Cart total: ${total}</p>
        {totalAfterDiscount > 0 && (
          <>
            <p className="bg-success p-2 mt-1 ">
              {" "}
              Discount applied : Total Payable ${totalAfterDiscount}
            </p>
          </>
        )}
        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                onClick={createCashOrder}
                className="btn btn-primary"
                disabled={!addressSaved}
              >
                Place Order
              </button>
            ) : (
              <button
                onClick={() => history.push("/payment")}
                className="btn btn-primary"
                disabled={!addressSaved}
              >
                Place Order
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

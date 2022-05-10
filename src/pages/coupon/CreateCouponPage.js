import { DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminNav from "../../components/nav/AdminNav";
import { createCoupon, getCoupons, removeCoupon } from "../../functions/coupon";
const CreateCouponPage = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  //Form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`${res.data.name} is created`);
      })
      .catch((error) => {
        console.log("Coupon Error ", error);
      });
  };

  //Get Coupons
  useEffect(() => {
    loadAllCoupons();
  }, [coupons]);
  const loadAllCoupons = () => {
    getCoupons().then((res) => {
      setCoupons(res.data);
    });
  };
  //Remove Coupon
  const handleRemove = (couponId) => {
    setLoading(true);
    removeCoupon(couponId, user.token).then((res) => {
      loadAllCoupons();
      setLoading(false);
      toast.error(`${res.data.name} Coupon deleted!`);
    });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? <h4>Coupon Create</h4> : <h4>Coupon</h4>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <DatePicker
                className="form-control"
                selected={expiry}
                value={expiry}
                onChange={(date) => setExpiry(date)}
              />
            </div>
            <button className="btn btn-outline-primary">Save</button>
            <br />
            <br />
            <h4>{coupons.length} Coupons</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Expiry</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{new Date(c.expiry).toLocaleDateString()}</td>
                    <td className="text-center">{c.discount}%</td>
                    <td className="text-center">
                      <DeleteOutlined
                        onClick={() => handleRemove(c._id)}
                        className="text-danger pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;

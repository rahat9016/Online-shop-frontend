import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import ShowPaymentInfo from "../cards/ShowPaymentInfo";
const Orders = ({ orders, handleStatusChange }) => {
  const showOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col ">Title</th>
          <th scope="col ">Price</th>
          <th scope="col ">Brand</th>
          <th scope="col ">Color</th>
          <th scope="col ">Count</th>
          <th scope="col ">Shipping</th>
        </tr>
      </thead>
      <tbody>
        {order.products.map((p, i) => (
          <tr key={i}>
            <td>
              <b>{p.product.title}</b>
            </td>
            <td>
              <b>{p.product.price}</b>
            </td>
            <td>
              <b>{p.product.brand}</b>
            </td>
            <td>
              <b>{p.color}</b>
            </td>
            <td>
              <b>{p.count}</b>
            </td>
            <td>
              <b>
                {p.product.shipping === "Yes" ? (
                  <CheckCircleOutlined style={{ color: "green" }} />
                ) : (
                  <CloseCircleOutlined style={{ color: "red" }} />
                )}
              </b>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <>
      {orders.map((order) => (
        <div key={order._id} className="row pb-5">
          <div className="btn btn-block bg-light">
            <ShowPaymentInfo order={order} showStatus={false} />
            <div className="row">
              <div className="col-md-4">Delivery Status</div>
              <div className="col-md-8">
                <select
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="form-control"
                  defaultValue={order.orderStatus}
                  name="status"
                >
                  <option value="Not Processing">Not Processing</option>
                  <option value="Processing">Processing</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          {showOrderInTable(order)}
        </div>
      ))}
    </>
  );
};

export default Orders;

import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculatorCartTotals } from "../../util/CartUtil";
import "./PlaceOrder.css";
import axios from "axios";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../util/Constants";
import { useNavigate } from "react-router-dom";
// import Razorpay from 'razorpay';

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const { subtotal, Shipping, tax, total } = calculatorCartTotals(
    cartItems,
    quantities
  );

  const onSubmitHandler = async (event) => {
    event.preventDefault();
   
    console.log("Token used:", token);

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName},${data.address}, ${data.city},${data.state},${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount:  Math.round(total),
      orderStatus: "preparing",
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/place",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201 && response.data.razorpayOrderId) {
        initiateRazorpayPayment(response.data); // fixed: was response.deta
      } else {
        toast.error("unable to place order. please try again.");
      }
    } catch (error) {
      console.error("Order creation error:", error?.response || error);
      toast.error("Unable to place order. please try again.");
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Food Land",
      description: "Food order payment",
      order_id: order.razorpayOrderId,
      handler: async function (razorpayResponse) {
        await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`, // fixed: added data.
        email: data.email,
        contact: data.phoneNumber,
      },
      method: {
       upi: true,         // ✅ Add this to show UPI option
       card: true,
       netbanking: true,
       wallet: true       // optional
        },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: async function () {
          toast.error("payment cancelled.");
          await deleteOrder(order.id);
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open(); // fixed: razorpay → rzp
  };

  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/verify",
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Payment successful.");
        await clearCart();
        navigate("/myorders");
      } else {
        toast.error("Payment failed.please try again.");
        navigate("/");
      }
    } catch (error) {
      toast.error("payment failed.please try again.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete("http://localhost:8080/api/orders/" + orderId, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      toast.error("Something went wrong. Cntact Support.");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` }, // fixed Beare → Bearer
      });
      setQuantities({});
    } catch (error) {
      toast.error("Error whileclearing the cart.");
    }
  };

  return (
    <div className="container mt-6">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto mb-4"
            src={assets.logo}
            alt=""
            width={120}
            height={120}
          />
        </div>

        {/* your JSX form continues below (unchanged) */}
        <div className="row">
          <div className="col-md-4 order-md-2 mb-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Your cart</span>
              <span className="badge bg-secondary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between lh-condensed">
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-muted">
                      Qty:{quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    &#8377;{item.price * quantities[item.id]}
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Shipping</span>
                </div>
                <span className="text-body-seondary">
                  {subtotal === 0 ? 0.0 : Shipping.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Tax(10%)</span>
                </div>
                <span className="text-body-secondary">
                  &#8377;{tax.toFixed(2)}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span>
                <strong>&#8377;{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>

          <div className="col-md-8 order-md-1">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder=""
                    required
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder=""
                    required
                    name="lastName"
                    onChange={onChangeHandler}
                    value={data.lastName}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="username">Email</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    required
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="1234 Main St"
                  required
                  name="address"
                  onChange={onChangeHandler}
                  value={data.address}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  id="phone"
                  placeholder="9123456780"
                  required
                  name="phoneNumber"
                  onChange={onChangeHandler}
                   value={data.phoneNumber}
                />
              </div>

              <div className="row">
                <div className="col-md-5 mb-3">
                  <label htmlFor="state">State</label>
                  <select
                    className="custom-select d-block w-100"
                    id="state"
                    required
                    name="state"
                    onChange={onChangeHandler}
                    value={data.state}
                  >
                    <option value="">Choose...</option>
                    <option>Telangana</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="city">City</label>
                  <select
                    className="custom-select d-block w-100"
                    id="city"
                    required
                    name="city"
                    onChange={onChangeHandler}
                    value={data.city}
                  >
                    <option value="">Choose...</option>
                    <option>Hyderabad</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="zip">Zip</label>
                  <select
                    type="number"
                    className="custom-select d-block w-100"
                    id="Zip"
                    required
                    name="zip"
                    onChange={onChangeHandler}
                    value={data.zip}
                  >
                    <option value="">Choose...</option>
                    <option>501301</option>
                    <option>508286</option>
                  </select>
                </div>
              </div>

              <hr className="mb-4" />

              <button
                className="btn btn-primary btn-lg btn-block"
                type="submit"
                style={{ width: "100%" }}
                disabled={cartItems.length === 0}
              >
                Continue to checkout
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PlaceOrder;

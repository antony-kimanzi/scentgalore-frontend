import React from "react";
import type { InputProps } from "../utils/types";
import "../styles/Checkout.scss";
import OrderSummary from "../components/OrderSummary";

const FloatingInput: React.FC<InputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
}) => {
  const [hasValue, setHasvalue] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasvalue(!!e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="floating-input">
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        className={`form-input ${hasValue && "has-value"}`}
      />
      <label htmlFor={id} className="form-label">
        {label}
      </label>
    </div>
  );
};

interface RadioInputProps extends InputProps {
  name: string;
  checked?: boolean;
}

const FloatingRadioInput: React.FC<RadioInputProps> = ({
  id,
  label,
  name,
  value,
  checked,
  onChange,
}) => {
  return (
    <div>
      <div className={`options ${checked && "is-checked"}`}>
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="radio-input"
        />
        <label htmlFor={id} className="radio-label">
          {label}
        </label>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [type, setType] = React.useState<string>("text");
  const [contact, setContact] = React.useState<string>("");
  const [shippingMethod, setShippingMethod] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [billingMethod, setBillingMethod] = React.useState<string>("");
  const [buttonText, setButtonText] = React.useState<string>("Complete Checkout")
  const shippingCost = shippingMethod === "delivery" ? 500 : 0;

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
    const value = e.target.value;
    if (value.includes("@")) {
      setType("email");
    } else {
      setType("text");
    }
  };

  const handleShippingMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingMethod(e.target.value);
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setPaymentMethod(e.target.value);
    if (value === "payNow") setButtonText("Proceed to Payment");
    else setButtonText("Complete Checkout");
  };

  const handleBillingMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBillingMethod(e.target.value);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="form-section">
                <h2>2.Checkout</h2>

          <div className="checkout-form">
            <div className="contact">
              <h3>Contact</h3>
              <FloatingInput
                id="email"
                type={type}
                value={contact}
                label="Email or mobile phone number"
                onChange={handleContactChange}
                required
              />
            </div>
            <div className="delivery">
              <h3>Delivery</h3>
              <div className="shipping-details">
                <h4>Shipping Address</h4>
                <div className="name-section">
                  <div>
                    <FloatingInput
                      id="first name"
                      type="text"
                      value={contact}
                      label="First Name"
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div>
                    <FloatingInput
                      id="last name"
                      type="text"
                      value={contact}
                      label="Last Name"
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>
                <FloatingInput
                  id="email address"
                  type="email"
                  value={contact}
                  label="Email address"
                  onChange={handleContactChange}
                  required
                />
                <FloatingInput
                  id="apartment"
                  type="text"
                  value={contact}
                  label="Apartment, suite, etc. (optional)"
                  onChange={handleContactChange}
                />
                <div className="city-section">
                  <FloatingInput
                    id="city"
                    type="text"
                    value={contact}
                    label="City"
                    onChange={handleContactChange}
                    required
                  />
                  <FloatingInput
                    id="postal code"
                    type="text"
                    value={contact}
                    label="Postal code (optional)"
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <FloatingInput
                  id="phone number"
                  type="text"
                  value={contact}
                  label="Phone number"
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className="shipping-method">
                <h4>Shipping Method</h4>
                <div className="shipping-options">
                  <FloatingRadioInput
                    id="pickup"
                    name="shippingMethod"
                    value="pickup"
                    label="In store pickup - Free"
                    onChange={handleShippingMethodChange}
                    checked={shippingMethod === "pickup"}
                  />
                  <FloatingRadioInput
                    id="delivery"
                    name="shippingMethod"
                    value="delivery"
                    label="Local delivery - $5.00"
                    onChange={handleShippingMethodChange}
                    checked={shippingMethod === "delivery"}
                  />
                </div>
              </div>
              <div className="payment">
                <h3>Payment</h3>
                <div className="payment-options">
                  <FloatingRadioInput
                    id="payNow"
                    name="paymentMethod"
                    value="payNow"
                    label="Pay now with M-Pesa"
                    onChange={handlePaymentMethodChange}
                    checked={paymentMethod === "payNow"}
                  />
                  <FloatingRadioInput
                    id="payLater"
                    name="paymentMethod"
                    value="payLater"
                    label="Pay upon delivery with M-Pesa or Cash"
                    onChange={handlePaymentMethodChange}
                    checked={paymentMethod === "payLater"}
                  />
                  <FloatingRadioInput
                    id="payInStore"
                    name="paymentMethod"
                    value="payInStore"
                    label="Pay in Store"
                    onChange={handlePaymentMethodChange}
                    checked={paymentMethod === "payInStore"}
                  />
                </div>
              </div>
              <div className="billing">
                <h3>Billing</h3>
                <div className="billing-options">
                  <FloatingRadioInput
                    id="sameAsShipping"
                    name="billingMethod"
                    value="sameAsShipping"
                    label="Same as shipping address"
                    onChange={handleBillingMethodChange}
                    checked={billingMethod === "sameAsShipping"}
                  />
                  <div>
                    <FloatingRadioInput
                      id="differentBilling"
                      name="billingMethod"
                      value="differentBilling"
                      label="Use a different billing address"
                      onChange={handleBillingMethodChange}
                      checked={billingMethod === "differentBilling"}
                    />
                    {billingMethod === "differentBilling" && (
                      <div>
                        <div className="billing-details">
                          <div className="name-section">
                            <div>
                              <FloatingInput
                                id="first name"
                                type="text"
                                value={contact}
                                label="First Name"
                                onChange={handleContactChange}
                                required
                              />
                            </div>
                            <div>
                              <FloatingInput
                                id="last name"
                                type="text"
                                value={contact}
                                label="Last Name"
                                onChange={handleContactChange}
                                required
                              />
                            </div>
                          </div>
                          <FloatingInput
                            id="email address"
                            type="email"
                            value={contact}
                            label="Email address"
                            onChange={handleContactChange}
                            required
                          />
                          <FloatingInput
                            id="apartment"
                            type="text"
                            value={contact}
                            label="Apartment, suite, etc. (optional)"
                            onChange={handleContactChange}
                          />
                          <div className="city-section">
                            <FloatingInput
                              id="city"
                              type="text"
                              value={contact}
                              label="City (optional)"
                              onChange={handleContactChange}
                            />
                            <FloatingInput
                              id="postal code"
                              type="text"
                              value={contact}
                              label="Postal code (optional)"
                              onChange={handleContactChange}
                              required
                            />
                          </div>
                          <FloatingInput
                            id="phone number"
                            type="text"
                            value={contact}
                            label="Phone number"
                            onChange={handleContactChange}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className="summary-section">
            <OrderSummary shippingCost={shippingCost} buttonText={buttonText} />
          </div>
      </div>
    </div>
  );
}

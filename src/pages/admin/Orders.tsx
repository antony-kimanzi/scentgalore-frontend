/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/admin/Orders.tsx - UPDATED WITH CONSISTENT STYLING
import React, { useEffect, useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import "../../styles/AdminOrders.scss";
import "../../styles/AdminResponsive.scss";

const AdminOrders: React.FC = () => {
  const { orders, fetchOrders, updateOrder, isLoading } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    await updateOrder(orderId, { status: newStatus });
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "pending_payment":
        return "pending-payment";
      case "paid":
        return "paid";
      case "processing":
        return "processing";
      case "shipped":
        return "shipped";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="page-header">
        <h1>Orders</h1>
      </div>

      <div className="orders-filters">
        <div className="filters-left">
          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <input
          type="text"
          className="search-box"
          placeholder="Search by order ID, customer name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal order-details-modal">
            <h2>Order Details #{selectedOrder.id}</h2>

            <div className="order-info">
              <div className="info-section">
                <h3>Customer Information</h3>
                <p>
                  <strong>Name:</strong> {selectedOrder.user?.firstName}{" "}
                  {selectedOrder.user?.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.user?.email}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedOrder.contact}
                </p>
              </div>

              <div className="info-section">
                <h3>Order Information</h3>
                <p>
                  <strong>Total Amount:</strong> Ksh{" "}
                  {selectedOrder.totalAmount?.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`status-badge ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p>
                  <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                </p>
                <p>
                  <strong>Shipping Method:</strong>{" "}
                  {selectedOrder.shippingMethod}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="order-items">
              <h3>Order Items</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item.product?.name}</td>
                      <td>{item.quantity}</td>
                      <td>Ksh {item.price?.toLocaleString()}</td>
                      <td>
                        Ksh {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeDetails}>
                Close
              </button>
              <div className="status-actions">
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td className="order-number">{index + 1}</td>
                <td className="order-id">#{order.id}</td>
                <td>
                  <div className="customer-info">
                    <span className="customer-name">
                      {order.user?.firstName} {order.user?.lastName}
                    </span>
                    <span className="customer-email">{order.user?.email}</span>
                  </div>
                </td>
                <td className="order-amount">
                  Ksh {order.totalAmount?.toLocaleString()}
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="payment-method">{order.paymentMethod}</td>
                <td className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(order)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

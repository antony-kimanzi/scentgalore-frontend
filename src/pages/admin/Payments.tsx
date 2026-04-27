/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/admin/Payments.tsx - UPDATED WITH CONSISTENT STYLING
import React, { useEffect, useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import "../../styles/AdminPayments.scss";
import "../../styles/AdminResponsive.scss";

const AdminPayments: React.FC = () => {
  const { payments, fetchPayments, updatePayment, isLoading } = useAdmin();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
  };

  const handleStatusChange = async (paymentId: number, newStatus: string) => {
    await updatePayment(paymentId, { status: newStatus });
  };

  const closeDetails = () => {
    setSelectedPayment(null);
  };

  // Filter payments based on status and search
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      filterStatus === "all" || payment.paymentStatus === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      payment.id.toString().includes(searchTerm) ||
      payment.orderId.toString().includes(searchTerm) ||
      payment.paymentPhone?.includes(searchTerm) ||
      payment.mpesaReceipt?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "completed";
      case "pending":
        return "pending";
      case "failed":
        return "failed";
      case "refunded":
        return "refunded";
      default:
        return "default";
    }
  };

  const formatMpesaReceipt = (receipt: string) => {
    if (!receipt) return "N/A";
    return receipt;
  };

  if (isLoading) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="admin-payments">
      <div className="page-header">
        <h1>Payments</h1>
      </div>

      <div className="payments-filters">
        <div className="filters-left">
          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
        <input
          type="text"
          className="search-box"
          placeholder="Search by payment ID, order ID, phone, or receipt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="modal-overlay">
          <div className="modal payment-details-modal">
            <h2>Payment Details #{selectedPayment.id}</h2>

            <div className="payment-info">
              <div className="info-section">
                <h3>Payment Information</h3>
                <p>
                  <strong>Payment ID:</strong> #{selectedPayment.id}
                </p>
                <p>
                  <strong>Order ID:</strong> #{selectedPayment.orderId}
                </p>
                <p>
                  <strong>Amount:</strong> Ksh{" "}
                  {selectedPayment.paymentAmount?.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`status-badge ${getStatusColor(selectedPayment.paymentStatus)}`}
                  >
                    {selectedPayment.paymentStatus}
                  </span>
                </p>
                <p>
                  <strong>Transaction Type:</strong>{" "}
                  {selectedPayment.transactionType}
                </p>
              </div>

              <div className="info-section">
                <h3>Customer Information</h3>
                <p>
                  <strong>Phone:</strong> {selectedPayment.paymentPhone}
                </p>
                <p>
                  <strong>MPesa Receipt:</strong>{" "}
                  {formatMpesaReceipt(selectedPayment.mpesaReceipt)}
                </p>
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {selectedPayment.paymentDate
                    ? new Date(selectedPayment.paymentDate).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedPayment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedPayment.order && (
              <div className="order-summary">
                <h3>Associated Order Summary</h3>
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedPayment.order.user?.firstName}{" "}
                  {selectedPayment.order.user?.lastName}
                </p>
                <p>
                  <strong>Order Total:</strong> Ksh{" "}
                  {selectedPayment.order.totalAmount?.toLocaleString()}
                </p>
                <p>
                  <strong>Order Status:</strong> {selectedPayment.order.status}
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeDetails}>
                Close
              </button>
              <div className="status-actions">
                <select
                  value={selectedPayment.paymentStatus}
                  onChange={(e) =>
                    handleStatusChange(selectedPayment.id, e.target.value)
                  }
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Receipt</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="payment-number">{index + 1}</td>
                <td className="payment-id">#{payment.id}</td>
                <td className="order-id">#{payment.orderId}</td>
                <td className="payment-amount">
                  Ksh {payment.paymentAmount?.toLocaleString()}
                </td>
                <td className="payment-phone">{payment.paymentPhone}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(payment.paymentStatus)}`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="receipt-code">
                  {formatMpesaReceipt(payment.mpesaReceipt)}
                </td>
                <td className="payment-date">
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(payment)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPayments.length === 0 && (
          <div className="no-payments">
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;

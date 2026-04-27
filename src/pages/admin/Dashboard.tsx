// pages/admin/Dashboard.tsx
import React, { useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import "../../styles/AdminDashboard.scss";
import "../../styles/AdminResponsive.scss";

const AdminDashboard: React.FC = () => {
  const { stats, recentOrders, recentPayments, fetchStats, isLoading } =
    useAdmin();

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Overview</h1>
        <div className="header-actions">
          <select className="date-range">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Revenue</div>
          </div>
          <div className="metric-value">
            Ksh {stats.totalRevenue?.toLocaleString()}
          </div>
          <div className="metric-details">
            <div className="detail">
              <span>Today</span>
              <div>Ksh {stats.todayRevenue?.toLocaleString()}</div>
            </div>
            <div className="detail">
              <span>This week</span>
              <div>Ksh {stats.weekRevenue?.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Orders</div>
          </div>
          <div className="metric-value">{stats.totalOrders || 0}</div>
          <div className="metric-details">
            <div className="detail">
              <span>Today</span>
              <div>{stats.todayOrders || 0}</div>
            </div>
            <div className="detail">
              <span>Pending</span>
              <div>{stats.pendingOrders || 0}</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Customers</div>
          </div>
          <div className="metric-value">{stats.totalUsers || 0}</div>
          <div className="metric-subtitle">Registered users</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Total Products</div>
          </div>
          <div className="metric-value">{stats.totalProducts || 0}</div>
          <div className="metric-subtitle">Active products</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Payments</div>
          </div>
          <div className="metric-value">{stats.completedPayments || 0}</div>
          <div className="metric-details">
            <div className="detail">
              <span>Completed</span>
              <div>{stats.completedPayments || 0}</div>
            </div>
            <div className="detail">
              <span>Pending</span>
              <div>{stats.pendingPayments || 0}</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Conversion Rate</div>
          </div>
          <div className="metric-value">{stats.conversionRate || 0}%</div>
          <div className="metric-subtitle">Order to payment</div>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-container">
          <div className="table-header">
            <h2>Recent Orders</h2>
            <div className="table-count">{recentOrders.length}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>{order.customerName || "Anonymous"}</td>
                  <td className="amount">
                    Ksh {order.totalAmount?.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`payment-method ${order.paymentMethod?.toLowerCase()}`}
                    >
                      {order.paymentMethod || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${order.status?.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>Recent Payments</h2>
            <div className="table-count">{recentPayments.length}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Payment</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="payment-id">#{payment.id}</td>
                  <td className="order-id">#{payment.orderId}</td>
                  <td className="amount">
                    Ksh {payment.amount?.toLocaleString()}
                  </td>
                  <td>{payment.method}</td>
                  <td>
                    <span
                      className={`status-badge ${payment.status?.toLowerCase()}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="receipt">
                    {payment.mpesaReceipt || payment.checkoutRequestID || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

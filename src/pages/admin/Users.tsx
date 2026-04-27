/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/admin/Users.tsx - UPDATED WITH CONSISTENT STYLING
import React, { useEffect, useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import "../../styles/AdminUsers.scss";
import "../../styles/AdminResponsive.scss";

const AdminUsers: React.FC = () => {
  const { users, fetchUsers, deleteUser, updateUser, isLoading } = useAdmin();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    return (
      searchTerm === "" ||
      user.id.toString().includes(searchTerm) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEdit = (user: any) => {
    setEditingUser({ ...user });
    setShowActionMenu(null);
  };

  const handleSaveEdit = async () => {
    if (editingUser) {
      await updateUser(editingUser.id, editingUser);
      setEditingUser(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      await deleteUser(id);
      setShowActionMenu(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleActionMenu = (id: number) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowActionMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>Users</h1>
        <div className="stats-badge">Total Users: {users.length}</div>
      </div>

      <div className="users-filters">
        <div className="filters-left">
          <div className="filter-group">
            <label htmlFor="role-filter">Role</label>
            <select id="role-filter" defaultValue="">
              <option value="">All Roles</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <input
          type="text"
          className="search-box"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit User</h2>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={editingUser.firstName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, firstName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={editingUser.lastName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, lastName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={editingUser.role || "client"}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Google ID</th>
              <th>Joined</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="user-number">{index + 1}</td>
                <td>
                  <div className="user-info">
                    <span className="user-name">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </td>
                <td className="user-email-cell">{user.email}</td>
                <td className="user-role">
                  <span className={`role-badge ${user.role}`}>
                    {user.role === "client" ? "Client" : "Admin"}
                  </span>
                </td>
                <td className="google-id">
                  <span
                    className={`google-badge ${user.googleId ? "yes" : "no"}`}
                  >
                    {user.googleId ? "✓" : "✗"}
                  </span>
                </td>
                <td className="join-date">{formatDate(user.createdAt)}</td>
                <td className="update-date">
                  {user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="more-actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionMenu(user.id);
                      }}
                      title="More actions"
                    >
                      ⋯
                    </button>
                    {showActionMenu === user.id && (
                      <div
                        className="action-menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="action-menu-item edit"
                          onClick={() => handleEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-menu-item delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="no-users">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

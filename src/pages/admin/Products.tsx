/* eslint-disable react-hooks/exhaustive-deps */

// pages/admin/Products.tsx - UPDATED WITH ORIGINAL FIELDS
import React, { useEffect, useState, useMemo } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import { useProduct } from "../../hooks/useProduct";
import "../../styles/AdminProducts.scss";
import "../../styles/AdminResponsive.scss";

const AdminProducts: React.FC = () => {
  const {
    products,
    fetchProducts,
    deleteProduct,
    updateProduct,
    addProduct,
    isLoading,
  } = useAdmin();
  const { fetchProduct, product } = useProduct();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    tone: "",
    category: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    imageUrl: "",
    tone: "",
    category: "",
    stock: "",
  });

  const [editingProduct, setEditingProduct] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    imageUrl: "",
    tone: "",
    category: "",
    stock: "",
  });
  const [productId, setProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());

      // Tone filter
      const matchesTone =
        filters.tone === "" ||
        product.tone?.toLowerCase() === filters.tone.toLowerCase();

      // Category filter
      const matchesCategory =
        filters.category === "" ||
        product.category?.toLowerCase() === filters.category.toLowerCase();

      return matchesSearch && matchesTone && matchesCategory;
    });
  }, [products, filters, searchTerm]);

  // Get unique tones and categories for filters
  const uniqueTones = useMemo(() => {
    const tones = products.map((p) => p.tone).filter(Boolean);
    return Array.from(new Set(tones));
  }, [products]);

  const uniqueCategories = useMemo(() => {
    const categories = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set(categories));
  }, [products]);

  const handleEdit = async (productId: number) => {
    setProductId(productId);

    await fetchProduct(productId);
    setShowActionMenu(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editingProduct) {
      console.log(editingProduct);
      await updateProduct(productId, {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
      });

      setShowEditModal(false);
      setEditingProduct({
        name: "",
        shortDescription: "",
        description: "",
        price: "",
        imageUrl: "",
        tone: "",
        category: "",
        stock: "",
      });
    }
  };

  const handleCancelEdit = async () => {
    setShowEditModal(false);
    setEditingProduct({
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      imageUrl: "",
      tone: "",
      category: "",
      stock: "",
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      setShowActionMenu(null);
    }
  };

  const handleAddProduct = async () => {
    await addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
    });
    setShowAddModal(false);
    setNewProduct({
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      imageUrl: "",
      tone: "",
      category: "",
      stock: "",
    });
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

  useEffect(() => {
    if (product) {
      setEditingProduct({
        name: product.name || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        price: String(product.price) || "",
        imageUrl: product.imageUrl || "",
        tone: product.tone || "",
        category: product.category || "",
        stock: String(product.stock) || "aa",
      });
    }
  }, [product]);

  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Products</h1>
        <button
          className="add-product-btn"
          onClick={() => setShowAddModal(true)}
        >
          <span>+</span>
          <span>Add Product</span>
        </button>
      </div>

      <div className="products-filters">
        <div className="filters-left">
          <div className="filter-group">
            <label htmlFor="tone-filter">Tone</label>
            <select
              id="tone-filter"
              value={filters.tone}
              onChange={(e) => setFilters({ ...filters, tone: e.target.value })}
            >
              <option value="">All Tones</option>
              {uniqueTones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input
          type="text"
          className="search-box"
          placeholder="Search products by name, description, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Product</h2>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <input
                type="text"
                value={newProduct.shortDescription}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    shortDescription: e.target.value,
                  })
                }
                placeholder="Enter short description"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Enter detailed description"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Price (Ksh)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={newProduct.imageUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>Tone</label>
              <input
                type="text"
                value={newProduct.tone}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, tone: e.target.value })
                }
                placeholder="Enter tone (e.g., Warm, Cool)"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <option value="">select category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                placeholder="0"
                step="1"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Product</h2>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <input
                type="text"
                value={editingProduct.shortDescription}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    shortDescription: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price (Ksh)</label>
              <input
                type="text"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={editingProduct.imageUrl}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    imageUrl: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Tone</label>
              <input
                type="text"
                value={editingProduct.tone}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    tone: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
              >
                <option value="">select category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="text"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: e.target.value,
                  })
                }
                step="1"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Tone</th>
              <th>Inventory</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id}>
                <td className="product-number">{index + 1}</td>
                <td>
                  <div className="product-info">
                    <img
                      src={product.imageUrl || "/placeholder-image.jpg"}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <span className="product-name">{product.name}</span>
                      <span className="product-description">
                        {product.shortDescription || "No description"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="product-price">
                  Ksh {product.price?.toLocaleString()}
                </td>
                <td className="product-category">{product.category || "-"}</td>
                <td className="product-tone">{product.tone || "-"}</td>
                <td>
                  <span className={"product-stock"}>
                    {product.stock} in stock
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="more-actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionMenu(product.id);
                      }}
                      title="More actions"
                    >
                      ⋯
                    </button>
                    {showActionMenu === product.id && (
                      <div
                        className="action-menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="action-menu-item edit"
                          onClick={() => handleEdit(product.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-menu-item delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

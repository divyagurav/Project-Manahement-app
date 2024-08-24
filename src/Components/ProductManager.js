import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./pruduct.css";
function ProductManager() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProducts = async () => {
    const response = await fetch(
      "https://ecommerce-website-a506b-default-rtdb.firebaseio.com/products.json"
    );
    const data = await response.json();
    return data
      ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
      : [];
  };

  const createProduct = async (product) => {
    const response = await fetch(
      "https://ecommerce-website-a506b-default-rtdb.firebaseio.com/products.json",
      {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  };

  const updateProduct = async (id, product) => {
    await fetch(
      `https://ecommerce-website-a506b-default-rtdb.firebaseio.com/products/${id}.json`,
      {
        method: "PUT",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const deleteProduct = async (id) => {
    await fetch(
      `https://ecommerce-website-a506b-default-rtdb.firebaseio.com/products/${id}.json`,
      {
        method: "DELETE",
      }
    );
  };

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateProduct(editingId, formData);
      setEditingId(null);
    } else {
      await createProduct(formData);
    }
    setFormData({ name: "", category: "", price: "" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
    });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <div>
      <h1>Product Module</h1>
      <form onSubmit={handleSubmit} className="container-sm">
        <input
          className="form-control mb-3 "
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary submit">
          {editingId ? "Update" : "Add"} Product
        </button>
      </form>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <th className="th">
                <button
                  onClick={() => handleEdit(product)}
                  className="btn btn-primary action-button"
                >
                  <FaEdit className="icon" />
                  <span className="button-text">Edit</span>
                </button>
                &nbsp;
                <button
                  onClick={() => handleDelete(product.id)}
                  className="btn btn-danger action-button"
                >
                  <FaTrash className="icon" />
                  <span className="button-text">Delete</span>
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManager;

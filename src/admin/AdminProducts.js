import { useEffect, useState } from "react";
import api from "../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("image", image);

    await api.post("/products", formData);
    setForm({ name: "", price: "", description: "", category: "" });
    setImage(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h2>Add Product</h2>

      <form onSubmit={submitHandler}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit">Add Product</button>
      </form>

      <hr />

      {products.map((p) => (
        <div key={p._id}>
          <img src={p.image?.url} width="120" alt={p.name} />
          <h4>{p.name}</h4>
          <p>${p.price}</p>
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}



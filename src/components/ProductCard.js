export default function ProductCard({ p, onAdd }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 10 }}>
      <img src={p.image} alt="" width="100%" />
      <h3>{p.title}</h3>
      <p>₹{p.price}</p>
      <button onClick={() => onAdd(p)}>Add to cart</button>
    </div>
  );
}

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h2>{product.title}</h2>
      <p>{product.category}</p>
      <p>${product.price}</p>
    </article>
  );
}

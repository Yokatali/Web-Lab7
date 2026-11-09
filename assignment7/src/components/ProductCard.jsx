import { Link } from "react-router";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h2>
        <Link to={`/products/${product.id}`}>{product.title}</Link>
      </h2>
      <p>{product.category}</p>
      <p>${product.price}</p>
    </article>
  );
}

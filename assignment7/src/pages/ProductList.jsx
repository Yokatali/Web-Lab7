import { fetchProducts } from "../api/productsApi.js";
import { useFetch } from "../hooks/useFetch.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductList() {
  const { loading, error, data } = useFetch(fetchProducts, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>;
  }

  return (
    <section>
      <h1>Products</h1>
      <div className="product-grid">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

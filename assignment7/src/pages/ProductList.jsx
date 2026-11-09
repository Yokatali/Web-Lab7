import { useSearchParams } from "react-router";
import { fetchProducts } from "../api/productsApi.js";
import { useFetch } from "../hooks/useFetch.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductList() {
  const { loading, error, data } = useFetch(fetchProducts, []);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>;
  }

  const categories = [
    ...new Set(data.map((product) => product.category)),
  ].sort();

  const filteredProducts = data.filter((product) => {
    const matchesTitle = product.title
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesCategory = category === "" || product.category === category;
    return matchesTitle && matchesCategory;
  });

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title"
          aria-label="Search by title"
          value={query}
          onChange={(event) => updateParam("q", event.target.value)}
        />
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => updateParam("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

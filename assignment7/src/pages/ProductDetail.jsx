import { useNavigate, useParams } from "react-router";
import { fetchProduct } from "../api/productsApi.js";
import { useFetch } from "../hooks/useFetch.js";
import { useCartStore } from "../store/cartStore.js";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { loading, error, data } = useFetch(
    (signal) => fetchProduct(id, signal),
    [id],
  );

  const backButton = (
    <button type="button" onClick={() => navigate("/products")}>
      Back
    </button>
  );

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return (
      <section>
        {backButton}
        <p>
          {error.status === 404
            ? "Product not found."
            : `Something went wrong: ${error.message}`}
        </p>
      </section>
    );
  }

  return (
    <section className="product-detail">
      {backButton}
      <img src={data.thumbnail} alt={data.title} />
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <p>Category: {data.category}</p>
      <p>Price: ${data.price}</p>
      <button type="button" onClick={() => addItem(data)}>
        Add to cart
      </button>
    </section>
  );
}

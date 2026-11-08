const BASE_URL = 'https://dummyjson.com'

async function request(url, signal) {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json()
}

export async function fetchProducts(signal) {
  const data = await request(`${BASE_URL}/products?limit=100`, signal)
  return data.products
}

export async function fetchProduct(id, signal) {
  return request(`${BASE_URL}/products/${id}`, signal)
}
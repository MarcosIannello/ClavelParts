import { fetchProducts } from "@/lib/api/products";
import { ProductsAdminPanel } from "@/components/admin/ProductsAdminPanel";

export default async function AdminProductsPage() {
  const products = await fetchProducts();

  return <ProductsAdminPanel initialProducts={products} />;
}


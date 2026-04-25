import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Package,
  Coffee,
  CupSoda,
  Cookie,
  CakeSlice,
  Utensils,
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Ban,
} from "lucide-react";
import CategoryTabs from "../components/POS/CategoryTabs.jsx";
import api from "../../api/axios.js";
/* ------------------ Dialog Component ---------------------- */
function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
/* ------------------ Summary Card Component ------------------ */
function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white border rounded-xl p-4 flex justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon size={28} className="text-gray-400" />
    </div>
  );
}

/* ------------------ Main Products Component ------------------ */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);

  /* -------------------- Card Category ------- ------------------ */
  useEffect(() => {
    api
      .get("/categories") // use your axios instance
      .then((res) => {
        const mapped = res.data.map((cat) => ({
          id: cat.id,
          name: cat.category_name,
          description: cat.description,
        }));
        setCategories(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);
  useEffect(() => {
    fetchProducts();
  }, []);
  const [newProduct, setNewProduct] = useState({
    name: "",
    nameKh: "",
    price: "",
    stock: "",
    category: "",
    available: true,
    image: null,
  });
  const handleSubmitProduct = async () => {
    if (loading) return;

    // ❌ Image required ONLY when adding
    if (!isEdit && !newProduct.image) {
      alert("Please select product image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("product_namekhmer", newProduct.nameKh);
    formData.append("product_nameenglish", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("status", newProduct.available ? "available" : "inactive");
    formData.append("category_id", newProduct.category);

    // ✅ Image optional on UPDATE
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      if (isEdit) {
        // 🔁 UPDATE
        await api.post(`/products/${editingId}`, formData);
        alert("Product updated successfully");
      } else {
        // ➕ ADD
        await api.post("/products", formData);
        alert("Product added successfully");
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error.response?.data || error);
      alert(isEdit ? "Update failed" : "Add product failed");
    } finally {
      setLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      console.log("API data:", res.data.datas); // ✅ works
      setProducts(res.data.datas);
    } catch (error) {
      console.error("Fetch products failed:", error);
    }
  };
  // Update Buttom
  const handleEdit = (product) => {
    setIsEdit(true);
    setEditingId(product.id);

    setNewProduct({
      nameKh: product.product_namekhmer || "",
      name: product.product_nameenglish || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category_id || "",
      image: null, // New image can be uploaded
      preview: product.image, // Add this for preview
      available: product.status === "available",
    });

    setIsDialogOpen(true);
  };
  //Delete Buttom
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/products/${productId}`);
      fetchProducts(); // Refresh the table
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed!");
    }
  };
  //Fillter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = product.category_name?.trim().toLowerCase();
      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      const matchesSearch =
        product.product_nameenglish
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.product_namekhmer
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("km-KH").format(price) + "៛";

  /* ------------------ Render ------------------ */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            // Reset form to default values
            setNewProduct({
              name: "",
              nameKh: "",
              price: "",
              stock: "",
              category: "",
              available: true,
              image: null,
              preview: null,
            });
            setIsEdit(false); // Make sure modal is in "Add" mode
            setEditingId(null);

            setIsDialogOpen(true); // Open modal
          }}
          className="flex items-center gap-2 rounded-lg bg-amber-800 px-4 py-2 text-white"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <CategoryTabs
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="ps-4 py-3 text-left">Image</th>
              <th className="py-3 text-left">Product</th>
              <th className="py-3 text-left">Category</th>
              <th className="py-3 text-left">Price</th>
              <th className="py-3 text-center">Stock</th>
              <th className="py-3  text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="ps-4 py-1">
                  <img
                    src={p.image}
                    className="w-14 h-14 rounded-md object-cover border"
                  />
                </td>

                <td className=" py-2">
                  <div className="font-medium">{p.product_nameenglish}</div>
                  <div className="text-xs text-gray-500">
                    {p.product_namekhmer}
                  </div>
                </td>

                <td className=" py-3 text-left capitalize">
                  {p.category.category_name}
                </td>

                <td className=" py-3 text-left font-mono">{p.price}៛</td>
                <td className=" py-3 text-center">
                  <span className="inline-block px-3 py-1 text-gray-700 bg-gray-300 rounded-full text-sm font-medium">
                    {p.stock} in stock
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-3 py-1 text-gray-600 bg-gray-300 rounded-full text-sm font-medium ${
                      p.status === "available"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {p.status === "available" ? "available" : "Inactives"}
                  </span>
                </td>
                <td className="  py-3 text-end w-5 ms-6  bg-danger flex  space-x-2">
                  <button
                    className="flex items-center gap-1 px-1 py-1 border-2 border-blue-300 text-blue-500 text-sm font-medium rounded hover:bg-blue-600 hover:text-white transition"
                    onClick={() => handleEdit(p)}
                  >
                    <Pencil className="w-4 h-4" />
                    Update
                  </button>
                  {/* Delete Button with red-800 and outline */}
                  <button
                    className="flex items-center gap-1 px-1 py-1  text-red-400 text-sm font-medium rounded border-2 border-red-300 hover:bg-red-700 transition"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <SummaryCard
          title="Total Products"
          value={products.length}
          icon={Package}
        />
        <SummaryCard
          title="Available"
          value={products.filter((p) => p.status === "available").length}
          icon={CheckCircle}
        />
        <SummaryCard
          title="Low Stock"
          value={products.filter((p) => p.stock <= 10 && p.stock > 0).length}
          icon={AlertTriangle}
        />
        <SummaryCard
          title="Out of Stock"
          value={products.filter((p) => p.stock == 0).length}
          icon={Ban}
        />
      </div>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Add New Product</h2>

        {/* Product Name English */}
        <input
          type="text"
          placeholder="Product Name (English) *"
          className="w-full border rounded-lg p-2 mb-2"
          value={newProduct.name || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        {/* Product Name Khmer */}
        <input
          type="text"
          placeholder="Product Name (Khmer)"
          className="w-full border rounded-lg p-2 mb-2"
          value={newProduct.nameKh || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, nameKh: e.target.value })
          }
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price *"
          className="w-full border rounded-lg p-2 mb-2"
          value={newProduct.price || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        {/* Stock */}
        <input
          type="number"
          placeholder="Stock"
          className="w-full border rounded-lg p-2 mb-2"
          value={newProduct.stock || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
        />

        {/* Category */}
        <select
          className="w-full border rounded-lg p-2 mb-4"
          value={newProduct.category || ""}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        >
          <option value="" disabled>
            Select category *
          </option>

          {categories
            .filter((c) => c.id !== 1)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Product Image
          </label>

          <label
            className={`relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer
    ${newProduct.image || newProduct.preview ? "border-amber-500" : "border-gray-300"}`}
          >
            {newProduct.image ? (
              <img
                src={URL.createObjectURL(newProduct.image)}
                alt="Preview"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : newProduct.preview ? (
              <img
                src={newProduct.preview}
                alt="Preview"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <span className="text-sm text-gray-400">
                Upload product image
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
            />
          </label>
        </div>

        {/* Available */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={newProduct.available}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                available: e.target.checked,
              })
            }
          />
          <span>Available for sale</span>
        </div>

        <button
          onClick={handleSubmitProduct}
          disabled={loading}
          className={`w-full p-2 rounded-lg font-medium text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-800"
          }`}
        >
          category_name
          <Plus size={16} className="inline-block mr-2" />
          {loading
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
              ? "Update Product"
              : "Add Product"}
        </button>
      </Dialog>
    </div>
  );
}

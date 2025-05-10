import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { 
  Loader2, 
  AlertCircle, 
  Package, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  IndianRupee,
  Tag,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Plus
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantityAvailable: number;
  isActive: boolean;
  farmerEmail: string;
  farmerName: string;
  imageUrl: string;
}

export default function AdminProductsView() {
  const { token } = useSelector(selectAuth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive" | "outOfStock">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3800/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const productsData = response.data;
      setProducts(productsData);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(productsData.map((p: Product) => p.category))
      ) as string[];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products data");
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      await axios.put(
        `http://localhost:3800/api/products/${productId}/toggle-active`,
        { isActive: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:3800/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || product.category === selectedCategory;
    
    const matchesStatus = 
      selectedStatus === "all" ||
      (selectedStatus === "active" && product.isActive) ||
      (selectedStatus === "inactive" && !product.isActive) ||
      (selectedStatus === "outOfStock" && product.quantityAvailable <= 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p className="font-semibold">Error</p>
          </div>
          <p className="mt-1">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor product listings</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          Add New Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
            Filter
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${
              isFilterOpen ? "transform rotate-180" : ""
            }`} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Category</p>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status</p>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.farmerName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {product.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    <Tag className="w-4 h-4 mr-1.5 text-emerald-500" />
                    {product.category}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                    <IndianRupee className="w-4 h-4 mr-0.5" />
                    {product.price}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stock</p>
                  <p className={`font-medium flex items-center ${
                    product.quantityAvailable <= 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white"
                  }`}>
                    <ShoppingBag className="w-4 h-4 mr-1.5" />
                    {product.quantityAvailable}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center">
                    {product.quantityAvailable <= 0 ? (
                      <AlertTriangle className="w-4 h-4 mr-1.5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
                    )}
                    {product.quantityAvailable <= 0 ? "Out of Stock" : "In Stock"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => handleToggleActive(product._id, product.isActive)}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 ${
                    product.isActive
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  } text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  {product.isActive ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
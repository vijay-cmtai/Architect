import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchProducts,
  deleteProduct,
  resetProductState,
  Product,
} from "@/lib/features/products/productSlice";
import { RootState, AppDispatch } from "@/lib/store";

import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProductModal from "./EditProductModal";

const AllProductsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.products
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(String(error));
      dispatch(resetProductState());
    }
  }, [actionStatus, error, dispatch]);

  const paginatedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const reversedProducts = products.slice().reverse();

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return reversedProducts.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const totalPages = Math.ceil((products?.length || 0) / PRODUCTS_PER_PAGE);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId)).then((res) => {
        if (res.type.endsWith("fulfilled")) {
          toast.success("Product deleted successfully!");
        }
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          <Link to="/admin/products/add">
            <Button>
              <PlusCircle size={18} className="mr-2" /> Add New Product
            </Button>
          </Link>
        </div>
        <p className="text-gray-600">
          Manage all your house plans and products here.
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 text-center flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
              Products...
            </div>
          ) : !products || products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Image
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Name
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Author
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Price
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => {
                    const productName =
                      product.name || product.Name || "Untitled";
                    const productImage =
                      product.mainImage ||
                      (product.Images
                        ? product.Images.split(",")[0].trim()
                        : undefined);
                    const productPrice =
                      product.price !== 0 && product.price
                        ? product.price
                        : (product["Regular price"] ?? 0);
                    const productStatus =
                      product.status ||
                      (product.Published === 1 ? "Published" : "Draft");

                    return (
                      <tr
                        key={product._id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <Avatar className="rounded-md">
                            <AvatarImage
                              src={productImage}
                              alt={productName}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {productName?.charAt(0) || "P"}
                            </AvatarFallback>
                          </Avatar>
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          {productName}
                        </td>
                        <td className="p-4 text-gray-600">
                          {product.user?.name || "N/A"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${productStatus === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                          >
                            {productStatus}
                          </span>
                        </td>
                        <td className="p-4 text-gray-800">
                          ₹
                          {productPrice > 0
                            ? productPrice.toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(product._id)}
                              disabled={actionStatus === "loading"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
};

export default AllProductsPage;

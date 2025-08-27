import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchProducts,
  deleteProduct,
  resetProductState,
} from "@/lib/features/products/productSlice";
import { RootState, store } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProductModal from "./EditProductModal";

const AllProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { products, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.products
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    (dispatch as typeof store.dispatch)(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded" && error) {
      toast.error(String(error));
      dispatch(resetProductState());
    } else if (actionStatus === "succeeded") {
      dispatch(resetProductState());
    }
  }, [actionStatus, error, dispatch]);

  
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          <Link to="/admin/products/add">
            <Button className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Add New Product
            </Button>
          </Link>
        </div>
        <p className="text-gray-600">
          Manage all your house plans and products here.
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 text-center text-gray-500 flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
              Products...
            </div>
          ) : !products || products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No products found.</p>
              <Link to="/admin/products/add">
                <Button variant="link" className="mt-2">
                  Create your first product
                </Button>
              </Link>
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
                  {products.map((product: any) => (
                    <tr key={product._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <Avatar className="rounded-md">
                          <AvatarImage
                            src={product.mainImage}
                            alt={product.name}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {product.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {product.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {product.user?.name || "N/A"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-800">
                        ₹{product.price.toLocaleString()}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default AllProductsPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  fetchMyPlans,
  deletePlan,
  updatePlan, // ✨ updatePlan thunk ko import karein
  resetPlanActionStatus,
} from "@/lib/features/professional/professionalPlanSlice";

import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, PackageOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ✨ Select component import karein
import EditPlanModal from "@/pages/professional/EditPlanModal";

// Helper function to get status color
const getStatusClass = (status) => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-700";
    case "Pending Review":
      return "bg-yellow-100 text-yellow-700";
    case "Draft":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MyProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { plans, listStatus, actionStatus, error } = useSelector(
    (state) => state.professionalPlans
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    dispatch(fetchMyPlans());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetPlanActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleDelete = (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      dispatch(deletePlan(planId)).then((res) => {
        if (!res.error) {
          toast.success("Plan deleted successfully!");
        }
      });
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };

  // ✨ NAYA FUNCTION: Status ko update karne ke liye ✨
  const handleStatusChange = (planId, newStatus) => {
    const planData = new FormData();
    planData.append("status", newStatus);

    dispatch(updatePlan({ planId, planData })).then((res) => {
      if (!res.error) {
        toast.success(`Plan status updated to "${newStatus}"`);
      }
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            My Plans & Products
          </h1>
          <Link to="/professional/add-product">
            <Button className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Add New Plan
            </Button>
          </Link>
        </div>
        <p className="text-gray-600">
          Manage all your uploaded house plans and designs here.
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 flex items-center justify-center text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Your
              Plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">You haven't uploaded any plans yet.</p>
              <Link to="/professional/add-product">
                <Button variant="link" className="mt-2">
                  Create your first plan
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
                      Plan Name
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Price
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Date Added
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <Avatar className="rounded-md">
                          <AvatarImage
                            src={plan.mainImage || plan.image}
                            alt={plan.planName}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {plan.planName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {plan.planName}
                      </td>
                      <td className="p-4">
                        {/* ✨ STATUS DROPDOWN YAHAN ADD KIYA GAYA HAI ✨ */}
                        <Select
                          value={plan.status}
                          onValueChange={(newStatus) =>
                            handleStatusChange(plan._id, newStatus)
                          }
                        >
                          <SelectTrigger
                            className={`w-[150px] text-xs font-semibold rounded-full border-0 focus:ring-0 ${getStatusClass(plan.status)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Pending Review">
                              Pending Review
                            </SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-gray-800">
                        ₹{plan.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-600">
                        {format(new Date(plan.createdAt), "dd MMM, yyyy")}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(plan._id)}
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

      {selectedPlan && (
        <EditPlanModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          plan={selectedPlan}
        />
      )}
    </>
  );
};

export default MyProductsPage;

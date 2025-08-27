import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  fetchUsers,
  deleteUserByAdmin,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, UserX } from "lucide-react";
import EditUserModal from "./EditUserModal";

const getRoleClass = (role) => {
  switch (role) {
    case "Admin":
      return "bg-red-100 text-red-700";
    case "professional":
      return "bg-blue-100 text-blue-700";
    case "seller":
      return "bg-green-100 text-green-700";
    case "partner":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AllUsersPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // useSelector ko seedha use karein, type casting ki zaroorat nahi
  const { users, pagination, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // ✨ FIX: (dispatch as any) ko hatayein. Yeh zaroori nahi hai. ✨
    dispatch(fetchUsers({}));
  }, [dispatch]);

  useEffect(() => {
    // Yeh logic bilkul theek hai
    if (actionStatus === "succeeded" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // ✨ FIX: (dispatch as any) ko hatayein. ✨
      dispatch(deleteUserByAdmin(userId) as any).then((result) => {
        // `unwrap()` ka istemaal behtar hai, lekin .then() bhi kaam karega
        if (deleteUserByAdmin.fulfilled.match(result)) {
          toast.success("User deleted successfully!");
        }
      });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
          <Link to="/admin/users/add">
            <Button className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Add New User
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 text-center text-gray-500 flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Users...
            </div>
          ) : !users || users.length === 0 ? ( // ✨ Behtar check: !users ko bhi check karein
            <div className="p-12 text-center text-gray-500">
              <UserX className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No users found.</p>
              <Link to="/admin/users/add">
                <Button variant="link" className="mt-2">
                  Create the first user
                </Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Name
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Email
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Role
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Status
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Registered
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {user.name || user.businessName || user.companyName}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {format(new Date(user.createdAt), "dd MMM, yyyy")}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(user._id)}
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
          )}
        </div>
      </div>

      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
    </>
  );
};
export default AllUsersPage;

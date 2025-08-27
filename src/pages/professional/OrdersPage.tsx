import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Clock } from "lucide-react";

// Placeholder data - aap ise backend API se fetch karenge
const professionalOrders = [
  {
    orderId: "#ARCH-8921",
    date: "June 24, 2024",
    customer: "Rohan Sharma",
    product: "Modern 4-Bedroom Villa",
    total: "₹15,000",
    status: "Files Delivered",
  },
  {
    orderId: "#ARCH-8765",
    date: "May 15, 2024",
    customer: "Priya Mehta",
    product: "Compact 2BHK Plan",
    total: "₹8,000",
    status: "Files Delivered",
  },
  {
    orderId: "#ARCH-9123",
    date: "July 02, 2024",
    customer: "Ankit Desai",
    product: "Luxury Villa Design",
    total: "₹25,000",
    status: "In Progress",
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Files Delivered":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrdersPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <p className="mt-1 text-gray-600">
          Track and manage orders for your products.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Orders
            </h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">1</p>
        </div>
        <div className="bg-gray-50 border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">
              Completed This Month
            </h3>
            <CheckCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">5</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Order ID
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Date
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Customer
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Product Sold
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Total
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Status
                </th>
                <th className="p-4 font-semibold text-sm text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {professionalOrders.map((order) => (
                <tr key={order.orderId} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-primary">
                    {order.orderId}
                  </td>
                  <td className="p-4 text-gray-600">{order.date}</td>
                  <td className="p-4 text-gray-800">{order.customer}</td>
                  <td className="p-4 text-gray-800 font-medium">
                    {order.product}
                  </td>
                  <td className="p-4 text-gray-600">{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

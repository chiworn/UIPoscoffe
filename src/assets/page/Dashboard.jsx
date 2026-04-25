import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Coffee, CupSoda, Cookie } from "lucide-react";
import SalesChart from "../components/dashboard/SalesChart";

export default function Dashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");

  const icons = {
    drink: CupSoda,
    coffee: Coffee,
    snacks: Cookie,
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("km-KH").format(price) + "៛";

  // ================= FETCH ORDERS =================
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get("/saller");
        setRecentOrders(res.data.Data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ================= FILTER ORDERS =================
  useEffect(() => {
    const now = new Date();
    let result = recentOrders;

    if (filter === "today") {
      result = recentOrders.filter(
        o => new Date(o.created_at).toDateString() === now.toDateString()
      );
    }

    // "all" → no filter
    setFilteredOrders(result);
  }, [filter, recentOrders]);

  // ================= TOTAL CALCULATIONS =================
  const totalOrders = filteredOrders.length;

  const totalCash = filteredOrders
    .filter(o => o.item?.payment_method?.toLowerCase() === "cash")
    .reduce((sum, o) => sum + Number(o.item?.total_amount || 0), 0);

  const totalKHQR = filteredOrders
    .filter(o => o.item?.payment_method?.toLowerCase() === "khqr")
    .reduce((sum, o) => sum + Number(o.item?.total_amount || 0), 0);

  const totalSales = filteredOrders
    .reduce((sum, o) => sum + Number(o.item?.total_amount || 0), 0);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Dashboard / Recent Orders
      </h1>
      <div className="">
         {/* ================= FILTER BUTTONS ================= */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("today")}
          className={`px-5 py-2 rounded-lg font-semibold ${
            filter === "today"
              ? "bg-orange-800 text-white"
              : "bg-gray-200"
          }`}
        >
          Today
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-lg font-semibold ${
            filter === "all"
              ? "bg-orange-800 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between">
          <p className="text-gray-600 font-semibold">Total Orders</p>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex justify-between">
          <p className="text-gray-600 font-semibold">Cash</p>
          <p className="text-xl font-bold">{formatPrice(totalCash)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex justify-between">
          <p className="text-gray-600 font-semibold">KHQR</p>
          <p className="text-xl font-bold">{formatPrice(totalKHQR)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex justify-between">
          <p className="text-gray-600 font-semibold">Total Sales</p>
          <p className="text-xl font-bold">{formatPrice(totalSales)}</p>
        </div>
      </div>

      </div>

     

      {/* ================= CHART ================= */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <SalesChart />
      </div>

      {/* ================= ORDERS TABLE ================= */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Qty
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cashier
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => {
                const product = order.item?.product;
                const category = product?.category?.category_name?.toLowerCase() || "coffee";
                const Icon = icons[category] || Coffee;

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.product_nameenglish}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {product.product_nameenglish}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.product_namekhmer}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      {order.item.total_qty}
                    </td>

                    <td className="px-4 py-2">
                      {order.cashier.name}
                    </td>

                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.item.payment_method.toLowerCase() === "cash"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.item.payment_method}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      {new Date(order.created_at).toLocaleString()}
                    </td>

                    <td className="px-4 py-2 text-right font-semibold">
                      {formatPrice(order.item.total_amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

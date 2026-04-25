import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function SalesChart() {
  const [period, setPeriod] = useState("week"); // week / month / year
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) =>
    new Intl.NumberFormat("km-KH").format(price) + "៛";

  // Helper: aggregate orders by period
  const aggregateSales = (orders, period) => {
    const result = {};

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      let key;

      if (period === "week") {
        // group by day of week
        key = date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (period === "month") {
        // group by week of month
        const week = Math.ceil(date.getDate() / 7);
        key = `Week ${week}`;
      } else if (period === "year") {
        // group by month
        key = date.toLocaleDateString("en-US", { month: "short" });
      }

      if (!result[key]) result[key] = 0;
      result[key] += Number(order.item?.total_amount || 0);
    });

    // convert to array
    return Object.entries(result).map(([name, sales]) => ({ name, sales }));
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/saller");
        const orders = response.data.Data || [];
        const aggregated = aggregateSales(orders, period);
        setChartData(aggregated);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]); // refetch when period changes

  if (loading) return <p className="text-center mt-5">Loading chart...</p>;

  return (
    <>
      {/* Header */}
      <div className="mb-1 flex items-center justify-between mt-3 ">
        <div>
          <h3 className="font-semibold text-gray-900">Sales Overview</h3>
          <p className="text-sm text-gray-500">
            {period === "week" && "Weekly sales"}
            {period === "month" && "Monthly sales"}
            {period === "year" && "Yearly sales"}
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { id: "week", label: "Week" },
            { id: "month", label: "Month" },
            { id: "year", label: "Year" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p.id
                  ? "bg-amber-800 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mt-5">
        <ResponsiveContainer width="100%" height="105%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(25 45% 25%)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(25 45% 25%)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(30 20% 88%)"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(25 15% 45%)", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(25 15% 45%)", fontSize: 12 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(30 20% 99%)",
                border: "1px solid hsl(30 20% 88%)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px -2px hsl(25 30% 15% / 0.12)",
              }}
              formatter={(value) => [`${formatPrice(value)}`, "Sales"]}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(25 45% 25%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

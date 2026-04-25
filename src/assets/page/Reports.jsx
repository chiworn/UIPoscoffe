import React from 'react';
import {
  Calendar,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";

import SalesChart from '../components/dashboard/SalesChart';

export default function Reports() {
  const reports = [
    { id: 1, name: "Daily Sales Report", date: "Dec 28, 2024", orders: 32, revenue: 125500, growth: 12 },
    { id: 2, name: "Daily Sales Report", date: "Dec 27, 2024", orders: 28, revenue: 112000, growth: -3 },
    { id: 3, name: "Daily Sales Report", date: "Dec 26, 2024", orders: 35, revenue: 145000, growth: 18 },
    { id: 4, name: "Daily Sales Report", date: "Dec 25, 2024", orders: 42, revenue: 168000, growth: 25 },
    { id: 5, name: "Daily Sales Report", date: "Dec 24, 2024", orders: 30, revenue: 115000, growth: 5 },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat('km-KH').format(price) + '៛';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 lg:p-6">

        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">View and export sales reports</p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100">
              <Calendar size={16} />
              Date Range
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-800">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <SalesChart />
        </div>

        {/* Reports List */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3">
            <h3 className="font-semibold text-gray-900">Recent Reports</h3>
            <p className="text-sm text-gray-600">Download previous sales reports</p>
          </div>

          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                    <FileText className="text-amber-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.date}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center sm:text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(report.revenue)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {report.orders} orders
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1 ${
                      report.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {report.growth >= 0 ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                    <span className="font-medium">
                      {Math.abs(report.growth)}%
                    </span>
                  </div>

                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                    <Download size={14} />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                title="Total Reports"
                value={reports.length}
                icon={FileText}
              />
              <SummaryCard
                title="Total Revenue"
                value={formatPrice(reports.reduce((s, r) => s + r.revenue, 0))}
                icon={BarChart3}
              />
              <SummaryCard
                title="Total Orders"
                value={reports.reduce((s, r) => s + r.orders, 0)}
                icon={BarChart3}
              />
              <SummaryCard
                title="Avg Growth"
                value={`${Math.round(
                  reports.reduce((s, r) => s + r.growth, 0) / reports.length
                )}%`}
                icon={TrendingUp}
              />
            </div>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="Most Profitable Day" value="Saturday" desc="Average revenue: 95,000៛" />
          <InfoCard title="Best Selling Product" value="Latte" desc="145 sold this week" />
          <InfoCard title="Busiest Time" value="3–5 PM" desc="Peak hours for sales" />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-200 bg-white px-4 py-3">
        <div className="text-center text-sm text-gray-500">
          <p>
            Coffee Shop POS Reports • Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-1">All data is for internal use only</p>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-lg bg-white p-3 border flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
      <Icon className="text-gray-400" />
    </div>
  );
}

function InfoCard({ title, value, desc }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-2xl font-bold text-amber-700">{value}</p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
    
import { useEffect, useState } from "react";
import transactionService from "../api/services/transactionService";
import AddTransactionModal from "../components/AddTransactionModal";
import StatsCards from "../components/StatsCards";
import AnalyticsSection from "../components/AnalyticsSection";
import TransactionTable from "../components/TransactionTable";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState({ message: [] });
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reserve, setReserve] = useState(0);

  const fetchStats = async () => {
    try {
      if (!stats) setLoading(true);
      const [statData, transData] = await Promise.all([
        transactionService.getStats(),
        transactionService.getTransactions(),
      ]);
      setStats(statData);
      setTransactions(transData || { message: [] });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    const prev = { ...transactions };
    setTransactions({
      ...transactions,
      message: transactions.message.filter((t) => t.id !== id),
    });
    try {
      await transactionService.daleteTransactions(id);
      fetchStats();
    } catch (e) {
      setTransactions(prev);
    }
  };

  const chartData = (transactions?.message || [])
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const existing = acc.find((i) => i.name === t.category);
      if (existing) existing.value += Number(t.amount);
      else acc.push({ name: t.category, value: Number(t.amount) });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const filteredTransactions = (transactions?.message || []).filter((t) => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesSearch =
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 bg-base-200 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Мій Капітал</h1>
        <button
          className="btn btn-primary shadow-lg"
          onClick={() => document.getElementById("add_modal").showModal()}
        >
          + Додати операцію
        </button>
      </div>

      <StatsCards
        stats={stats}
        loading={loading}
        reserve={reserve}
        setReserve={setReserve}
      />
      <AnalyticsSection chartData={chartData} />
      <TransactionTable
        transactions={filteredTransactions}
        loading={loading}
        onDelete={handleDelete}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <AddTransactionModal onTransactionAdded={fetchStats} />
    </div>
  );
}

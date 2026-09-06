import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Plus, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { tableService } from '../../services/tableService';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import TableCard from '../../components/table/TableCard';
import TableStatusModal from '../../components/table/TableStatusModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

export const TableListPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { selectTable, setOrderType } = useOrder();
  const { success, error } = useToast();

  const [tables, setTables] = useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Status Change Modal
  const [statusModalTable, setStatusModalTable] = useState(null);

  // Create/Edit Table Modal
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableFormData, setTableFormData] = useState({ number: '', capacity: '4', status: 'Available' });
  const [tableErrors, setTableErrors] = useState({});

  // Delete Table Modal
  const [tableToDelete, setTableToDelete] = useState(null);

  const fetchTables = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await tableService.getAll(selectedStatusFilter !== 'all' ? selectedStatusFilter : '');
      if (res.success && res.data) {
        setTables(res.data);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleQuickStatusUpdate = async (tableId, newStatus) => {
    const res = await tableService.updateStatus(tableId, newStatus);
    if (res.success) {
      success(res.message);
      fetchTables();
    } else {
      error(res.message || 'Gagal mengubah status meja');
    }
  };

  const handleCreateOrderForTable = (table) => {
    selectTable(table.id, table.number);
    setOrderType('DineIn');
    navigate('/orders/create');
  };

  const handleOpenAddTable = () => {
    setSelectedTable(null);
    const nextNum = tables.length > 0 ? Math.max(...tables.map((t) => t.number)) + 1 : 1;
    setTableFormData({ number: nextNum, capacity: '4', status: 'Available' });
    setTableErrors({});
    setIsTableModalOpen(true);
  };

  const handleOpenEditTable = (table) => {
    setSelectedTable(table);
    setTableFormData({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
    });
    setTableErrors({});
    setIsTableModalOpen(true);
  };

  const handleSaveTable = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!tableFormData.number || Number(tableFormData.number) <= 0) errs.number = 'Nomor meja tidak valid';
    if (!tableFormData.capacity || Number(tableFormData.capacity) <= 0) errs.capacity = 'Kapasitas minimal 1 orang';
    setTableErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      let res;
      if (selectedTable) {
        res = await tableService.update(selectedTable.id, tableFormData);
      } else {
        res = await tableService.create(tableFormData);
      }

      if (res.success) {
        success(selectedTable ? 'Data meja berhasil diperbarui!' : 'Meja baru berhasil ditambahkan!');
        setIsTableModalOpen(false);
        fetchTables();
      } else {
        error(res.message || 'Gagal menyimpan meja');
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan sistem');
    }
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete) return;
    const res = await tableService.delete(tableToDelete.id);
    if (res.success) {
      success(`Meja #${tableToDelete.number} berhasil dihapus`);
      setTableToDelete(null);
      fetchTables();
    } else {
      error(res.message || 'Gagal menghapus meja');
    }
  };

  // Counts for status chips
  const totalCount = tables.length;
  const availableCount = tables.filter((t) => t.status === 'Available').length;
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'Reserved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Grid className="w-6 h-6 text-amber-600" />
            <span>Manajemen Meja Café</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Visual floor plan dan status okupansi meja pelanggan secara real-time.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddTable}
            icon={<Plus className="w-4 h-4" />}
          >
            Tambah Meja
          </Button>
        )}
      </div>

      {/* Filter Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedStatusFilter === 'all'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Semua Meja ({totalCount})
        </button>

        <button
          onClick={() => setSelectedStatusFilter('Available')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            selectedStatusFilter === 'Available'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white border border-stone-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Available ({availableCount})</span>
        </button>

        <button
          onClick={() => setSelectedStatusFilter('Occupied')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            selectedStatusFilter === 'Occupied'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white border border-stone-200 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Occupied ({occupiedCount})</span>
        </button>

        <button
          onClick={() => setSelectedStatusFilter('Reserved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            selectedStatusFilter === 'Reserved'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white border border-stone-200 text-indigo-700 hover:bg-indigo-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Reserved ({reservedCount})</span>
        </button>
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Memuat data meja...</p>
        </div>
      ) : tables.length === 0 ? (
        <EmptyState
          title="Tidak ada meja ditemukan"
          description="Coba pilih filter status yang lain atau tambahkan meja baru."
          actionLabel={isAdmin ? 'Tambah Meja' : undefined}
          onAction={isAdmin ? handleOpenAddTable : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              isAdmin={isAdmin}
              onSelectStatus={(t) => setStatusModalTable(t)}
              onCreateOrder={handleCreateOrderForTable}
              onEdit={handleOpenEditTable}
              onDelete={(t) => setTableToDelete(t)}
            />
          ))}
        </div>
      )}

      {/* Quick Status Modal */}
      <TableStatusModal
        isOpen={!!statusModalTable}
        onClose={() => setStatusModalTable(null)}
        table={statusModalTable}
        onUpdateStatus={handleQuickStatusUpdate}
      />

      {/* Create / Edit Table Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title={selectedTable ? `Edit Meja #${selectedTable.number}` : 'Tambah Meja Baru'}
        subtitle="Konfigurasi nomor meja dan kapasitas tempat duduk"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSaveTable} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Nomor Meja <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={tableFormData.number}
              onChange={(e) => setTableFormData({ ...tableFormData, number: e.target.value })}
              placeholder="e.g. 11"
              min="1"
              className={`w-full px-3.5 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                tableErrors.number ? 'border-rose-400' : 'border-stone-200 focus:border-amber-500'
              }`}
            />
            {tableErrors.number && <p className="text-xs text-rose-500 mt-1">{tableErrors.number}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Kapasitas Tempat Duduk (Orang) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={tableFormData.capacity}
              onChange={(e) => setTableFormData({ ...tableFormData, capacity: e.target.value })}
              placeholder="e.g. 4"
              min="1"
              max="20"
              className={`w-full px-3.5 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                tableErrors.capacity ? 'border-rose-400' : 'border-stone-200 focus:border-amber-500'
              }`}
            />
            {tableErrors.capacity && <p className="text-xs text-rose-500 mt-1">{tableErrors.capacity}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Status Awal
            </label>
            <select
              value={tableFormData.status}
              onChange={(e) => setTableFormData({ ...tableFormData, status: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
            >
              <option value="Available">Available (Kosong)</option>
              <option value="Occupied">Occupied (Terisi)</option>
              <option value="Reserved">Reserved (Dipesan)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
            <Button variant="outline" onClick={() => setIsTableModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {selectedTable ? 'Simpan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {tableToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Konfirmasi Hapus Meja</h3>
            <p className="text-xs text-stone-600">
              Apakah Anda yakin ingin menghapus{' '}
              <span className="font-bold text-stone-900">Meja #{tableToDelete.number}</span>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTableToDelete(null)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteTable}
              >
                Hapus Meja
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TableListPage;

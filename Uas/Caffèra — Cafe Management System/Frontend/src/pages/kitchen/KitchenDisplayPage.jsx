import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Clock,
  Volume2,
  VolumeX,
  RefreshCw,
  ChefHat,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatRupiah, parseSafeDate } from '../../utils/formatters';

export const KitchenDisplayPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All'); // All, DineIn, Takeaway
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const prevPendingCountRef = useRef(0);

  // Play Web Audio Chime for new incoming orders
  const playChime = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }, []);

  // Fetch kitchen active orders
  const fetchOrders = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await orderService.getAll({ pageSize: 100 });
      if (res.success && res.data?.items) {
        // Only active kitchen orders (Pending, Preparing, Ready)
        const active = res.data.items.filter(
          (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
        );
        
        // Check if new pending orders arrived to trigger chime
        const pendingCount = active.filter((o) => o.status === 'Pending').length;
        if (!isInitial && soundEnabled && pendingCount > prevPendingCountRef.current) {
          playChime();
        }
        prevPendingCountRef.current = pendingCount;
        setOrders(active);
      }
    } catch (err) {
      console.error('Failed to load kitchen orders:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [soundEnabled, playChime]);

  useEffect(() => {
    fetchOrders(true);
    // Auto poll every 4 seconds for real-time kitchen experience
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 4000);

    // Live clock
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateStatus(orderId, newStatus);
      if (res.success) {
        fetchOrders(false);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Helper for elapsed time
  const getElapsedMinutes = (dateString) => {
    if (!dateString) return '< 1 mnt';
    const created = parseSafeDate(dateString);
    let diffMs = currentTime.getTime() - created.getTime();

    // If slight negative skew or clock desync, clamp to 0
    if (diffMs < 0) {
      diffMs = 0;
    }

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return '< 1 mnt';
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    const diffHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return `${diffHours} jam ${remMins} mnt lalu`;
  };

  const filteredOrders = orders.filter((o) => {
    if (filterType === 'All') return true;
    return o.orderType === filterType;
  });

  const pendingList = filteredOrders.filter((o) => o.status === 'Pending');
  const preparingList = filteredOrders.filter((o) => o.status === 'Preparing');
  const readyList = filteredOrders.filter((o) => o.status === 'Ready');

  return (
    <div className="space-y-6">
      {/* Top Header & Kitchen Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black text-white p-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider">
              KITCHEN DISPLAY SYSTEM (KDS)
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Pantau antrean pesanan masak dapur & bar secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Clock */}
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs font-mono text-[#fbb710] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#fbb710]" />
            <span>{currentTime.toLocaleTimeString('id-ID')}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                : 'bg-red-950 text-red-300 border border-red-800'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Notif Suara ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Notif Suara OFF</span>
              </>
            )}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchOrders(false)}
            className="bg-[#fbb710] text-black hover:bg-yellow-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              filterType === 'All'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            onClick={() => setFilterType('DineIn')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              filterType === 'DineIn'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Dine In ({orders.filter((o) => o.orderType === 'DineIn').length})
          </button>
          <button
            onClick={() => setFilterType('Takeaway')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              filterType === 'Takeaway'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Takeaway ({orders.filter((o) => o.orderType === 'Takeaway').length})
          </button>
        </div>

        <div className="text-xs font-semibold text-neutral-500">
          Total Antrean Aktif:{' '}
          <span className="font-bold text-black">{filteredOrders.length} Pesanan</span>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: PENDING (BARU MASUK) */}
        <div className="bg-neutral-50 border border-neutral-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                1. Baru Masuk (Pending)
              </h2>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2 py-0.5 rounded">
              {pendingList.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {pendingList.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 italic">
                Tidak ada pesanan baru
              </div>
            ) : (
              pendingList.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border-2 border-amber-400 p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        #{order.orderNumber}
                      </span>
                      <div className="text-base font-black text-black">
                        {order.tableNumber ? `MEJA ${order.tableNumber}` : 'TAKEAWAY'}{order.customerName ? ` (${order.customerName})` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                        {getElapsedMinutes(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="border-t border-b border-neutral-100 py-2.5 my-2.5 space-y-1.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between items-start text-xs">
                          <span className="font-bold text-neutral-800">
                            <span className="inline-block w-5 font-black text-black">
                              {item.quantity}x
                            </span>{' '}
                            {item.menuName}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-[10px] text-amber-800 font-semibold italic pl-5">
                            * {item.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                    className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs py-2.5 uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Mulai Masak</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: PREPARING (SEDANG DIMASAK) */}
        <div className="bg-neutral-50 border border-neutral-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                2. Sedang Dimasak (Cooking)
              </h2>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded">
              {preparingList.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {preparingList.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 italic">
                Belum ada pesanan yang sedang dimasak
              </div>
            ) : (
              preparingList.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border-2 border-blue-400 p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        #{order.orderNumber}
                      </span>
                      <div className="text-base font-black text-black">
                        {order.tableNumber ? `MEJA ${order.tableNumber}` : 'TAKEAWAY'}{order.customerName ? ` (${order.customerName})` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        {getElapsedMinutes(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="border-t border-b border-neutral-100 py-2.5 my-2.5 space-y-1.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between items-start text-xs">
                          <span className="font-bold text-neutral-800">
                            <span className="inline-block w-5 font-black text-blue-600">
                              {item.quantity}x
                            </span>{' '}
                            {item.menuName}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-[10px] text-blue-800 font-semibold italic pl-5">
                            * {item.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Pending')}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-[11px] py-2 uppercase transition cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'Ready')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] py-2 uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Siap Saji</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: READY (SIAP DISAJIKAN) */}
        <div className="bg-neutral-50 border border-neutral-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                3. Siap Disajikan (Ready)
              </h2>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded">
              {readyList.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {readyList.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 italic">
                Tidak ada pesanan menunggu diantar
              </div>
            ) : (
              readyList.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border-2 border-emerald-400 p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        #{order.orderNumber}
                      </span>
                      <div className="text-base font-black text-black">
                        {order.tableNumber ? `MEJA ${order.tableNumber}` : 'TAKEAWAY'}{order.customerName ? ` (${order.customerName})` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        {getElapsedMinutes(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="border-t border-b border-neutral-100 py-2.5 my-2.5 space-y-1.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between items-start text-xs">
                          <span className="font-bold text-neutral-800">
                            <span className="inline-block w-5 font-black text-emerald-600">
                              {item.quantity}x
                            </span>{' '}
                            {item.menuName}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-[10px] text-emerald-800 font-semibold italic pl-5">
                            * {item.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Button: Selesai / Diantar */}
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'Completed')}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Diantar / Selesai</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplayPage;

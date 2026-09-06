import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { useToast } from './ToastContext';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { success, error } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);
  const [orderType, setOrderType] = useState('DineIn');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Item to Cart
  const addItem = useCallback((menu) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuId === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          menuId: menu.id,
          name: menu.name,
          price: Number(menu.price),
          imageUrl: menu.imageUrl,
          categoryName: menu.categoryName,
          quantity: 1,
          note: '',
        },
      ];
    });
  }, []);

  // Remove Item from Cart
  const removeItem = useCallback((menuId) => {
    setCartItems((prev) => prev.filter((item) => item.menuId !== menuId));
  }, []);

  // Update Quantity
  const updateQuantity = useCallback((menuId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.menuId !== menuId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.menuId === menuId ? { ...item, quantity: qty } : item
        )
      );
    }
  }, []);

  // Update Note for specific item
  const updateItemNote = useCallback((menuId, note) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.menuId === menuId ? { ...item, note } : item
      )
    );
  }, []);

  // Set Table Selection
  const selectTable = useCallback((id, number) => {
    setTableId(id);
    setTableNumber(number);
  }, []);

  // Clear Cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setTableId(null);
    setTableNumber(null);
    setCustomerName('');
  }, []);

  // Computed Values
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const tax = useMemo(() => {
    return Math.round(subtotal * 0.1); // 10% PB1 Restaurant Tax
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  const totalItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Submit Order to backend / storage
  const submitOrder = async () => {
    if (cartItems.length === 0) {
      error('Keranjang pesanan masih kosong');
      return { success: false, message: 'Keranjang kosong' };
    }

    if (orderType === 'DineIn' && !tableId) {
      error('Silakan pilih nomor meja untuk pesanan Dine In');
      return { success: false, message: 'Meja belum dipilih' };
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        tableId: orderType === 'DineIn' ? tableId : null,
        orderType,
        customerName: customerName.trim() || undefined,
        items: cartItems.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          price: item.price,
          note: item.note,
        })),
      };

      const res = await orderService.create(orderPayload);
      if (res.success && res.data) {
        success(`Pesanan ${res.data.orderNumber} berhasil dibuat!`);
        clearCart();
        return { success: true, data: res.data };
      } else {
        error(res.message || 'Gagal membuat pesanan');
        return { success: false, message: res.message };
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan sistem');
      return { success: false, message: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    cartItems,
    tableId,
    tableNumber,
    orderType,
    customerName,
    isSubmitting,
    subtotal,
    tax,
    totalAmount,
    totalItemCount,
    addItem,
    removeItem,
    updateQuantity,
    updateItemNote,
    selectTable,
    setOrderType,
    setCustomerName,
    clearCart,
    submitOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

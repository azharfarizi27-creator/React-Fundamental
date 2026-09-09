import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import MenuListPage from '../pages/menus/MenuListPage';
import MenuDetailPage from '../pages/menus/MenuDetailPage';
import CategoryListPage from '../pages/categories/CategoryListPage';
import TableListPage from '../pages/tables/TableListPage';
import OrderListPage from '../pages/orders/OrderListPage';
import CreateOrderPage from '../pages/orders/CreateOrderPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import TableSelfOrderPage from '../pages/customer/TableSelfOrderPage';
import KitchenDisplayPage from '../pages/kitchen/KitchenDisplayPage';
import SalesHistoryPage from '../pages/sales/SalesHistoryPage';
import StaffListPage from '../pages/users/StaffListPage';
import NotFoundPage from '../pages/NotFoundPage';
import { useAuth } from '../context/AuthContext';

// Helper component for dashboard routing based on role
const DashboardRoute = () => {
  const { isKitchen } = useAuth();
  if (isKitchen) {
    return <Navigate to="/kitchen" replace />;
  }
  return <DashboardPage />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Customer Self-Order Route (No Login Required) */}
      <Route path="/table-order/:tableNumber" element={<TableSelfOrderPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Main App Routes (Protected) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardRoute />} />

        {/* Menu Routes (Admin & Cashier) */}
        <Route
          path="/menus"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <MenuListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menus/:id"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <MenuDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Category Routes (Admin & Cashier) */}
        <Route
          path="/categories"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <CategoryListPage />
            </ProtectedRoute>
          }
        />

        {/* Table Management (Admin & Cashier) */}
        <Route
          path="/tables"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <TableListPage />
            </ProtectedRoute>
          }
        />

        {/* Kitchen Display System (KDS - All Roles) */}
        <Route path="/kitchen" element={<KitchenDisplayPage />} />

        {/* Order / POS Routes */}
        <Route path="/orders" element={<OrderListPage />} />
        <Route
          path="/orders/create"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
              <CreateOrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="/orders/:id" element={<OrderDetailPage />} />

        {/* Sales & Financial History (Admin Only) */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <SalesHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Staff & User Management (Admin Only) */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <StaffListPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch All inside layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;

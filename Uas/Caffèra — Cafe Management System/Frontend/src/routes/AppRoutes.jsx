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
import SalesHistoryPage from '../pages/sales/SalesHistoryPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
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
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Menu Routes */}
        <Route path="/menus" element={<MenuListPage />} />
        <Route path="/menus/:id" element={<MenuDetailPage />} />

        {/* Category Routes */}
        <Route path="/categories" element={<CategoryListPage />} />

        {/* Table Management */}
        <Route path="/tables" element={<TableListPage />} />

        {/* Order / POS Routes */}
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/create" element={<CreateOrderPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />

        {/* Sales & Financial History */}
        <Route path="/sales" element={<SalesHistoryPage />} />

        {/* 404 Catch All inside layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;

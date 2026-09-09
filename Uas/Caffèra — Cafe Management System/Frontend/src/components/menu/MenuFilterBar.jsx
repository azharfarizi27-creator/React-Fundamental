import React from 'react';
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import SearchInput from '../common/SearchInput';

export const MenuFilterBar = ({
  search = '',
  onSearchChange,
  selectedCategory = 'all',
  onCategoryChange,
  categories = [],
  availability = 'all',
  onAvailabilityChange,
  sortBy = 'name',
  sortOrder = 'asc',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full md:max-w-md">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Cari menu café..."
          />
        </div>

        {/* Right Tools: Availability, Sorting & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Availability Select */}
          <select
            value={availability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#fbb710] shadow-xs cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="true">Tersedia (In Stock)</option>
            <option value="false">Habis (Sold Out)</option>
          </select>

          {/* Sort Select */}
          <div className="flex items-center gap-1 bg-white border border-stone-200 p-1 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 ml-2" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                onSortChange(sb, so);
              }}
              className="px-2 py-1 bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="name-asc">Nama (A - Z)</option>
              <option value="name-desc">Nama (Z - A)</option>
              <option value="price-asc">Harga (Terendah)</option>
              <option value="price-desc">Harga (Tertinggi)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex items-center bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'text-stone-400 hover:text-stone-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'text-stone-400 hover:text-stone-800'
                }`}
                title="Table List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#fbb710] text-stone-950 shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-950'
          }`}
        >
          Semua Kategori
        </button>

        {categories.map((cat) => {
          const isSelected = String(selectedCategory) === String(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#fbb710] text-stone-950 shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-950'
              }`}
            >
              <span>{cat.name}</span>
              {cat.totalMenus !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-stone-950 text-white font-bold'
                      : 'bg-stone-100 text-stone-500 font-bold'
                  }`}
                >
                  {cat.totalMenus}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default MenuFilterBar;

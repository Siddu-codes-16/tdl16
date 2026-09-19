'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { SortField, SortDirection } from '@/types/todo';

export const TaskFilterBar: React.FC = () => {
  const { filter, setFilter, categories } = useTodo();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, search: e.target.value }));
  };

  const clearSearch = () => {
    setFilter((prev) => ({ ...prev, search: '' }));
  };

  const handleSortChange = (field: SortField) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: field,
      sortDirection: prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 my-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filter.search}
          onChange={handleSearchChange}
          placeholder="Search by title, description or tag..."
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/60 dark:bg-slate-950/60 border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500/50 transition-colors"
        />
        {filter.search && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters (Category, Priority, Status, Sort) */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
        {/* Category Dropdown */}
        <select
          value={filter.category}
          onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
          className="px-3 py-2 rounded-xl bg-slate-900/60 dark:bg-slate-950/60 border border-white/10 text-xs text-slate-300 outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Priority Dropdown */}
        <select
          value={filter.priority}
          onChange={(e) => setFilter((prev) => ({ ...prev, priority: e.target.value }))}
          className="px-3 py-2 rounded-xl bg-slate-900/60 dark:bg-slate-950/60 border border-white/10 text-xs text-slate-300 outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Sort Button */}
        <div className="flex items-center rounded-xl bg-slate-900/60 dark:bg-slate-950/60 border border-white/10 p-0.5">
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter((prev) => ({ ...prev, sortBy: e.target.value as SortField }))}
            className="bg-transparent px-2.5 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="order">Custom Order</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title (A-Z)</option>
          </select>
          <button
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc',
              }))
            }
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={`Sort ${filter.sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

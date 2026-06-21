import React from "react";
import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

function CatalogFilters({
  categories = [],
  searchTerm,
  selectedCategory,
  selectedAvailability,
  minimumPrice,
  maximumPrice,
  priceCeiling,
  onSearchTermChange,
  onCategoryChange,
  onAvailabilityChange,
  onMinimumPriceChange,
  onMaximumPriceChange
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
      className="landing-glass p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[14px] border border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8]">
          <Filter className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a7e4e8]">
            Search and Filters
          </p>
          <h2 className="mt-1 text-xl font-semibold">Find the right medicine</h2>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-washi/42" aria-hidden="true" />
          <input
            className="min-h-12 w-full rounded-full border border-washi/10 bg-[#102436]/60 pl-11 pr-4 text-sm text-washi outline-none transition placeholder:text-washi/35 focus:border-[#a7e4e8]/40 focus:shadow-[0_0_34px_rgba(147,214,220,.09)]"
            placeholder="Search by medicine name"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
        </label>

        <select
          className="min-h-12 rounded-full border border-washi/10 bg-[#102436]/60 px-4 text-sm text-washi/80 outline-none focus:border-[#a7e4e8]/40"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="min-h-12 rounded-full border border-washi/10 bg-[#102436]/60 px-4 text-sm text-washi/80 outline-none focus:border-[#a7e4e8]/40"
          value={selectedAvailability}
          onChange={(event) => onAvailabilityChange(event.target.value)}
        >
          <option value="all">Any availability</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <div className="min-h-12 rounded-[18px] border border-washi/10 bg-[#102436]/60 px-4 py-3 text-sm text-washi/60">
          <div className="mb-2 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#ffc2bd]" aria-hidden="true" />
            <span>Price range: ${minimumPrice} - ${maximumPrice}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="range"
              min="0"
              max={priceCeiling}
              step="1"
              aria-label="Minimum price"
              value={minimumPrice}
              onChange={(event) => onMinimumPriceChange(Number(event.target.value))}
              className="w-full accent-[#a7e4e8]"
            />
            <input
              type="range"
              min="0"
              max={priceCeiling}
              step="1"
              aria-label="Maximum price"
              value={maximumPrice}
              onChange={(event) => onMaximumPriceChange(Number(event.target.value))}
              className="w-full accent-[#ffaaa5]"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default CatalogFilters;

import React from "react";
import { motion } from "framer-motion";

function statusClass(status) {
  if (status === "Critical") return "border-koi/40 bg-koi/10 text-koi shadow-[0_0_18px_rgba(255,54,95,.1)]";
  if (status === "Low Stock") return "border-sakura/40 bg-sakura/10 text-sakura shadow-[0_0_18px_rgba(255,122,162,.1)]";
  return "border-clinic/35 bg-clinic/10 text-clinic shadow-[0_0_16px_rgba(141,248,255,.08)]";
}

function InventoryTable({
  products,
  categories,
  formData,
  formErrors,
  isSaving,
  editingProductId,
  onFormChange,
  onSubmit,
  onEdit,
  onCancelEdit,
  onDelete
}) {
  return (
    <motion.article
      id="products"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      className="dashboard-glass overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 border-b border-clinic/10 bg-clinic/[0.025] p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clinic">Inventory</p>
          <h2 className="mt-2 text-xl font-semibold text-washi">Product Stock Matrix</h2>
        </div>
        <span className="hidden border border-clinic/30 bg-clinic/10 px-3 py-2 text-xs text-clinic shadow-glow sm:inline-flex">
          Live stock view
        </span>
      </div>

      <form id="upload-product" onSubmit={onSubmit} className="border-b border-clinic/10 p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sakura">
              Product Management
            </p>
            <h3 className="mt-2 text-lg font-semibold text-washi">
              {editingProductId ? "Edit product" : "Create product"}
            </h3>
          </div>
          {editingProductId ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="border border-washi/10 bg-[#102033]/60 px-3 py-2 text-xs font-semibold text-washi/65 transition hover:border-clinic/35 hover:text-clinic"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Product name
            </span>
            <input
              className="min-h-11 w-full border border-washi/10 bg-[#102033]/70 px-3 text-sm text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              value={formData.name}
              onChange={(event) => onFormChange("name", event.target.value)}
              placeholder="Medicine name"
            />
            {formErrors.name ? <p className="mt-1 text-xs text-koi">{formErrors.name}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Slug
            </span>
            <input
              className="min-h-11 w-full border border-washi/10 bg-[#102033]/70 px-3 text-sm text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              value={formData.slug}
              onChange={(event) => onFormChange("slug", event.target.value)}
              placeholder="medicine-slug"
            />
            {formErrors.slug ? <p className="mt-1 text-xs text-koi">{formErrors.slug}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Category
            </span>
            <select
              className="min-h-11 w-full border border-washi/10 bg-[#102033]/70 px-3 text-sm text-washi outline-none transition focus:border-clinic/45"
              value={formData.category_id}
              onChange={(event) => onFormChange("category_id", event.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formErrors.category_id ? (
              <p className="mt-1 text-xs text-koi">{formErrors.category_id}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Price
            </span>
            <input
              className="min-h-11 w-full border border-washi/10 bg-[#102033]/70 px-3 text-sm text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(event) => onFormChange("price", event.target.value)}
              placeholder="0.00"
            />
            {formErrors.price ? <p className="mt-1 text-xs text-koi">{formErrors.price}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Stock quantity
            </span>
            <input
              className="min-h-11 w-full border border-washi/10 bg-[#102033]/70 px-3 text-sm text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              type="number"
              min="0"
              step="1"
              value={formData.stock_quantity}
              onChange={(event) => onFormChange("stock_quantity", event.target.value)}
              placeholder="0"
            />
            {formErrors.stock_quantity ? (
              <p className="mt-1 text-xs text-koi">{formErrors.stock_quantity}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Low-stock threshold
            </span>
            <input
              className="min-h-11 w-full border border-washi/10 bg-[#102033]/70 px-3 text-sm text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              type="number"
              min="0"
              step="1"
              value={formData.low_stock_threshold}
              onChange={(event) => onFormChange("low_stock_threshold", event.target.value)}
              placeholder="5"
            />
            {formErrors.low_stock_threshold ? (
              <p className="mt-1 text-xs text-koi">{formErrors.low_stock_threshold}</p>
            ) : null}
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Product image
            </span>
            <input
              className="min-h-11 w-full border border-washi/10 bg-[#102033]/70 px-3 py-2 text-sm text-washi outline-none transition file:mr-4 file:border-0 file:bg-clinic/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-clinic focus:border-clinic/45"
              type="file"
              accept="image/*"
              onChange={(event) => onFormChange("image", event.target.files?.[0] || null)}
            />
            {formData.image_url ? (
              <p className="mt-2 text-xs text-washi/45">Current image is saved for this product.</p>
            ) : null}
            {formData.image ? (
              <p className="mt-2 text-xs text-clinic">{formData.image.name}</p>
            ) : null}
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Description
            </span>
            <textarea
              className="min-h-20 w-full resize-none border border-washi/10 bg-[#102033]/70 px-3 py-3 text-sm leading-6 text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              value={formData.description}
              onChange={(event) => onFormChange("description", event.target.value)}
              placeholder="Short product description"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Dosage note
            </span>
            <textarea
              className="min-h-20 w-full resize-none border border-washi/10 bg-[#102033]/70 px-3 py-3 text-sm leading-6 text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              value={formData.dosage_note}
              onChange={(event) => onFormChange("dosage_note", event.target.value)}
              placeholder="Label or pharmacist dosage guidance"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-clinic/70">
              Safety note
            </span>
            <textarea
              className="min-h-20 w-full resize-none border border-washi/10 bg-[#102033]/70 px-3 py-3 text-sm leading-6 text-washi outline-none transition placeholder:text-washi/30 focus:border-clinic/45"
              value={formData.safety_note}
              onChange={(event) => onFormChange("safety_note", event.target.value)}
              placeholder="Warnings or professional advice"
            />
          </label>

          <label className="inline-flex items-center gap-3 text-sm text-washi/72">
            <input
              type="checkbox"
              checked={formData.requires_prescription}
              onChange={(event) => onFormChange("requires_prescription", event.target.checked)}
              className="h-4 w-4 accent-[#8df8ff]"
            />
            Requires prescription
          </label>

          <label className="inline-flex items-center gap-3 text-sm text-washi/72">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(event) => onFormChange("is_active", event.target.checked)}
              className="h-4 w-4 accent-[#8df8ff]"
            />
            Active product
          </label>
        </div>

        {formErrors.form ? <p className="mt-3 text-sm text-koi">{formErrors.form}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-5 border border-clinic/40 bg-clinic/10 px-5 py-3 text-sm font-semibold text-clinic shadow-glow transition hover:bg-clinic/15 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isSaving ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-clinic/10 bg-[#102338]/42 text-xs uppercase tracking-[0.16em] text-clinic/55">
            <tr>
              <th className="px-5 py-4 font-medium">Product Name</th>
              <th className="px-5 py-4 font-medium">Image</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-washi/10 transition hover:bg-clinic/[0.055]">
                <td className="px-5 py-4 font-semibold text-washi">{product.name}</td>
                <td className="px-5 py-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <span className="text-xs text-washi/38">No image</span>
                  )}
                </td>
                <td className="px-5 py-4 text-washi/64">{product.category}</td>
                <td className="px-5 py-4 text-washi/78">{product.stock}</td>
                <td className="px-5 py-4 text-washi/78">{product.price}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${statusClass(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="border border-clinic/30 bg-clinic/10 px-3 py-1.5 text-xs font-semibold text-clinic transition hover:bg-clinic/15"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="border border-koi/35 bg-koi/10 px-3 py-1.5 text-xs font-semibold text-koi transition hover:bg-koi/15"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.article>
  );
}

export default InventoryTable;

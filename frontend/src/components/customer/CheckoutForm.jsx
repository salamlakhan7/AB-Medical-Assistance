import React from "react";
import { motion } from "framer-motion";
import { CreditCard, FileUp, MapPin, Phone, User } from "lucide-react";

const inputClass =
  "min-h-12 w-full rounded-[18px] border border-washi/12 bg-washi/[0.055] px-4 text-sm text-washi outline-none transition placeholder:text-washi/35 focus:border-[#a7e4e8]/45 focus:bg-[#dff8f8]/10";

function CheckoutForm({ values, onChange }) {
  function updateField(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="landing-glass p-5 sm:p-6"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a7e4e8]">
          Checkout Details
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-washi">Delivery and payment</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-washi/72">
            <User className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
            Customer name
          </span>
          <input
            className={inputClass}
            placeholder="Amina Rahman"
            value={values.customer_name}
            onChange={(event) => updateField("customer_name", event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-washi/72">
            <Phone className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
            Phone
          </span>
          <input
            className={inputClass}
            placeholder="+92 300 0000000"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-washi/72">
            <MapPin className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
            Delivery address
          </span>
          <textarea
            className={`${inputClass} min-h-28 resize-none py-3 leading-6`}
            placeholder="House, street, area, city"
            value={values.delivery_address}
            onChange={(event) => updateField("delivery_address", event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-washi/72">
            <CreditCard className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
            Payment method
          </span>
          <select
            className={inputClass}
            value={values.payment_method}
            onChange={(event) => updateField("payment_method", event.target.value)}
          >
            <option value="cash">Cash on delivery</option>
            <option value="card_at_pharmacy">Card at pharmacy</option>
            <option value="wallet">Digital wallet</option>
          </select>
        </label>

        <div>
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-washi/72">
            <FileUp className="h-4 w-4 text-[#a7e4e8]" aria-hidden="true" />
            Prescription upload
          </span>
          <label className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#ffaaa5]/35 bg-[#ffaaa5]/10 px-4 text-center text-sm font-semibold text-[#ffc2bd] transition hover:bg-[#ffaaa5]/15">
            <FileUp className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {values.prescription_file?.name || "Attach prescription"}
            </span>
            <input
              className="sr-only"
              type="file"
              accept="image/*,.pdf"
              onChange={(event) => updateField("prescription_file", event.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>
    </motion.section>
  );
}

export default CheckoutForm;

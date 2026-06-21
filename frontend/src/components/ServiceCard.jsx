import React from "react";
import { motion } from "framer-motion";

function ServiceCard({ icon: Icon, title, copy, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="landing-glass group p-6"
    >
      <div className="mb-9 grid h-12 w-12 place-items-center rounded-[14px] border border-[#a7e4e8]/25 bg-[#a7e4e8]/10 text-[#a7e4e8] transition group-hover:border-[#ffaaa5]/35 group-hover:text-[#ffc2bd]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-washi">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-washi/60">{copy}</p>
    </motion.article>
  );
}

export default ServiceCard;

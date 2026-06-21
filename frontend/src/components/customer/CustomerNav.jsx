import React from "react";

const navItems = [
  ["Dashboard", "/customer-dashboard"],
  ["Products", "/products"],
  ["AI Assistant", "/ai-assistant"],
  ["Cart", "/cart"],
  ["Orders", "/orders"],
  ["Logout", "/logout"]
];

function CustomerNav() {
  return (
    <div className="flex max-w-[min(100%,720px)] flex-wrap items-center justify-end gap-2 sm:gap-3">
      {navItems.map(([label, href]) => (
        <a
          key={href}
          href={href}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            href === "/logout"
              ? "border-washi/15 bg-washi/[0.055] text-washi/72 hover:border-[#ffaaa5]/35 hover:text-[#ffc2bd]"
              : "border-washi/15 bg-washi/[0.055] text-washi/72 hover:border-[#a7e4e8]/35 hover:text-[#a7e4e8]"
          }`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

export default CustomerNav;

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-washi/15 bg-washi/[0.055] px-4 text-sm font-semibold text-washi/72 backdrop-blur transition hover:border-[#a7e4e8]/40 hover:bg-[#a7e4e8]/10 hover:text-[#a7e4e8]"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back
    </button>
  );
}

export default BackButton;

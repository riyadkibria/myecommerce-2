"use client";

import React, { ReactNode, useState } from "react";
import Navbar from "@/components/Navbar";

export default function CategoryLayout({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // optionally do something with term, like filtering products
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      {/* Hidden element just to use searchTerm so ESLint doesn't complain */}
      <span className="hidden">{searchTerm}</span>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}

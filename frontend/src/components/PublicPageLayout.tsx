import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const PublicPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] font-sans text-[#FAFAFA] antialiased selection:bg-[rgba(254,150,56,0.2)] selection:text-[#FE9638]">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
};

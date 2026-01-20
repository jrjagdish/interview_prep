// components/Layout/Layout.js

import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-950">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
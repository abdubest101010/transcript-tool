import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#33353F] text-gray-400 py-8 text-center text-xs">
      <div className="container mx-auto px-4">
        <p>© {new Date().getFullYear()} Transcript QR & Photo Replacer Tool. All rights reserved.</p>
      </div>
    </footer>
  );
}

"use client";

import { Suspense } from "react";
import PriceListsManager from "@/components/admin/PriceListsManager";

export default function AdminPriceListsPage() {
  return (
    <div style={{ width: "100%", paddingBottom: "3rem" }}>
      <Suspense fallback={<div style={{ padding: "2rem", color: "#011c5b" }}>Loading Price Lists Manager...</div>}>
        <PriceListsManager />
      </Suspense>
    </div>
  );
}

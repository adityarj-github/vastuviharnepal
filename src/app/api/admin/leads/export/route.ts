import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessLeads } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user || !canAccessLeads(user.role)) {
    return NextResponse.json({ error: "Forbidden: sales team or root admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const status = searchParams.get("status");

    const whereClause: Record<string, unknown> = {};
    if (source && source !== "ALL") whereClause.source = source;
    if (status && status !== "ALL") whereClause.status = status;

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Format rows for Excel
    const rows = leads.map((lead, idx) => ({
      "S.N.": idx + 1,
      "Lead ID": lead.id,
      "Full Name": lead.fullName,
      "Phone Number": lead.phone,
      "Email Address": lead.email || "N/A",
      "Lead Source": lead.source,
      "Residence Model": lead.residenceName || "N/A",
      "Budget Range": lead.budget || "N/A",
      "Purpose": lead.purpose || "N/A",
      "Preferred Location": lead.locationPref || "N/A",
      "Interest / Topic": lead.interestType || "N/A",
      "Blog Article": lead.blogSlug || "N/A",
      "Inquiry Message": lead.message || "N/A",
      "Current Status": lead.status,
      "Internal Notes": lead.notes || "",
      "Received At": lead.createdAt.toISOString().replace("T", " ").substring(0, 19),
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Auto-size columns based on content
    const colWidths = Object.keys(rows[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...rows.map((r) => String((r as Record<string, unknown>)[key] || "").length)
      );
      return { wch: Math.min(Math.max(maxLen + 2, 12), 45) };
    });
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vastu Vihar Leads");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `Vastu_Vihar_Nepal_Leads_${dateStr}.xlsx`;

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json({ error: "Failed to generate Excel export" }, { status: 500 });
  }
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, CheckCircle, XCircle, Clock, Search, Filter, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  industrySector: string;
  type: string;
  verificationStatus: string;
  rating: number;
  createdAt: string;
  _count: { wasteListings: number; users: number };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "ALL") params.set("status", filter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/companies?${params}`);
      const data = await res.json();
      if (data.success) setCompanies(data.data);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const updateStatus = async (companyId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Company ${status.toLowerCase()}`);
        fetchCompanies();
      }
    } catch {
      toast.error("Failed to update company status");
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <Badge variant="success">Approved</Badge>;
      case "PENDING": return <Badge variant="warning">Pending</Badge>;
      case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
      case "SUSPENDED": return <Badge variant="destructive">Suspended</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Management</h1>
          <p className="text-sm text-slate-500 mt-1">Verify, approve, and manage registered companies</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchCompanies()}
                className="pl-9"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Companies</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-4">Company</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-4">Sector</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-4">Type</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-4">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-4">Listings</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-4">Joined</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((company) => (
                  <tr key={company.id} className="data-table-row">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{company.name}</p>
                          <p className="text-xs text-slate-500">{company._count.users} user(s)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{company.industrySector}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{company.type}</Badge>
                    </td>
                    <td className="py-3 px-4">{statusBadge(company.verificationStatus)}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{company._count.wasteListings}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{formatDate(company.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {company.verificationStatus === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(company.id, "APPROVED")}
                            >
                              <CheckCircle className="w-3 h-3" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(company.id, "REJECTED")}
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </Button>
                          </>
                        )}
                        {company.verificationStatus === "APPROVED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(company.id, "SUSPENDED")}
                          >
                            Suspend
                          </Button>
                        )}
                        <Link href={`/admin/companies/${company.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                      No companies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

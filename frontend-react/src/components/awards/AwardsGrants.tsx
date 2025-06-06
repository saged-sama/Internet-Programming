import { useState, useMemo } from "react";
import type { Award } from "../../types/financials";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface AwardsGrantsProps {
  awards: Award[];
  isAdmin?: boolean;
  onApprove?: (awardId: string) => void;
  onReject?: (awardId: string) => void;
}

export function AwardsGrants({
  awards,
  isAdmin = false,
  onApprove,
  onReject,
}: AwardsGrantsProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const years = useMemo(() => {
    const uniqueYears = [...new Set(awards.map((a) => a.year))].sort(
      (a, b) => b - a
    );
    return uniqueYears;
  }, [awards]);

  const filteredAwards = useMemo(() => {
    return awards.filter((award) => {
      const matchesYear =
        selectedYear === "all" || award.year.toString() === selectedYear;
      const matchesType = selectedType === "all" || award.type === selectedType;
      const matchesSearch =
        award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesYear && matchesType && matchesSearch;
    });
  }, [awards, selectedYear, selectedType, searchQuery]);

  const getStatusColor = (status: Award["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getTypeColor = (type: Award["type"]) => {
    switch (type) {
      case "research":
        return "bg-blue-500";
      case "academic":
        return "bg-purple-500";
      case "competition":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <h2>Awards & Grants</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="competition">Competition</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search awards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
        </TabsList>

        {["all", "research", "academic", "competition"].map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAwards
                .filter((award) => type === "all" || award.type === type)
                .map((award) => (
                  <Card key={award.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{award.title}</span>
                        <div className="flex space-x-2">
                          <Badge className={getTypeColor(award.type)}>
                            {award.type}
                          </Badge>
                          <Badge className={getStatusColor(award.status)}>
                            {award.status}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Year: {award.year}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Recipient: {award.recipient}
                        </p>
                        {award.amount && (
                          <p className="text-sm text-muted-foreground">
                            Amount: ${award.amount.toLocaleString()}
                          </p>
                        )}
                        <p className="text-sm">{award.description}</p>
                        {isAdmin && award.status === "pending" && (
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={() => onApprove?.(award.id)}
                              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onReject?.(award.id)}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

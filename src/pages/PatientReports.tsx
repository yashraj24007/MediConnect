import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Eye, Filter, Calendar, User, Search } from "lucide-react";

export default function PatientReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const reports = [
    {
      id: 1,
      patientName: "John Doe",
      patientId: "P001",
      reportType: "Lab Results",
      testName: "Complete Blood Count (CBC)",
      date: "2025-10-20",
      status: "Completed",
      findings: "All parameters within normal range"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientId: "P002",
      reportType: "X-Ray",
      testName: "Chest X-Ray",
      date: "2025-10-19",
      status: "Completed",
      findings: "No abnormalities detected"
    },
    {
      id: 3,
      patientName: "Robert Johnson",
      patientId: "P003",
      reportType: "Consultation",
      testName: "Follow-up Consultation",
      date: "2025-10-18",
      status: "Completed",
      findings: "Patient responding well to treatment"
    },
    {
      id: 4,
      patientName: "Emily Davis",
      patientId: "P004",
      reportType: "Lab Results",
      testName: "Lipid Profile",
      date: "2025-10-17",
      status: "Pending Review",
      findings: "Awaiting doctor's review"
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.testName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || report.reportType === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const reportTypes = ["all", "Lab Results", "X-Ray", "Consultation", "Prescription"];

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-4 flex items-center gap-3">
            <FileText className="w-10 h-10" />
            Patient Reports
          </h1>
          <p className="text-lg text-muted-foreground">
            View, generate, and manage patient medical reports and test results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-3xl font-bold">{reports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {reports.filter(r => r.status === "Completed").length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {reports.filter(r => r.status === "Pending Review").length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {reports.filter(r => {
                      const reportDate = new Date(r.date);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return reportDate >= weekAgo;
                    }).length}
                  </p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or test..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {reportTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedFilter === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(type)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {type === "all" ? "All Reports" : type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">{report.testName}</h3>
                        <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.reportType}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Patient</p>
                          <p className="font-medium">{report.patientName}</p>
                          <p className="text-xs text-muted-foreground">ID: {report.patientId}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {new Date(report.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Findings</p>
                          <p className="font-medium">{report.findings}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Generate Report Button */}
        <div className="mt-8 text-center">
          <Button size="lg" className="w-full md:w-auto">
            <FileText className="w-5 h-5 mr-2" />
            Generate New Report
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, FileText, Download, Upload, Calendar } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  date: string;
  category?: string;
}

export default function FileShare() {
  const files: FileItem[] = [
    {
      id: "1",
      name: "2025",
      type: "folder",
      date: "Jan 15, 2025",
    },
    {
      id: "2", 
      name: "Lab Results",
      type: "folder",
      date: "Jan 10, 2025",
    },
    {
      id: "3",
      name: "X-Ray Reports",
      type: "folder", 
      date: "Dec 28, 2024",
    },
    {
      id: "4",
      name: "Blood Test - Complete Panel.pdf",
      type: "file",
      size: "2.4 MB",
      date: "Jan 12, 2025",
      category: "Lab Results"
    },
    {
      id: "5",
      name: "Prescription - Dr. Carter.pdf",
      type: "file",
      size: "1.1 MB", 
      date: "Jan 08, 2025",
      category: "Prescriptions"
    },
    {
      id: "6",
      name: "MRI Scan Results.pdf",
      type: "file",
      size: "15.3 MB",
      date: "Dec 20, 2024",
      category: "Imaging"
    }
  ];

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary mb-2">
            Files & Documents
          </h1>
          <p className="text-muted-foreground">
            Access your medical records, lab results, and shared documents.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="medical-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Share documents with your healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop files here to upload</h3>
              <p className="text-muted-foreground mb-4">
                Supported formats: PDF, JPG, PNG, DOC (Max 25MB)
              </p>
              <Button variant="outline">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Files Grid */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              Browse and manage your medical files and folders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
                >
                  <div className="text-center space-y-3">
                    {file.type === "folder" ? (
                      <Folder className="w-16 h-16 mx-auto text-yellow-500" />
                    ) : (
                      <FileText className="w-16 h-16 mx-auto text-primary" />
                    )}
                    
                    <div className="space-y-1">
                      <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {file.name}
                      </p>
                      
                      {file.category && (
                        <Badge variant="secondary" className="text-xs">
                          {file.category}
                        </Badge>
                      )}
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {file.date}
                        </div>
                        {file.size && (
                          <div>{file.size}</div>
                        )}
                      </div>
                    </div>
                    
                    {file.type === "file" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {files.length === 0 && (
              <div className="text-center py-12">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No files or folders found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload your first document to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
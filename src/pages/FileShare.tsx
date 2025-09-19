import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Folder, FileText, Download, Upload, Calendar, Share, Trash2, Eye, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  date: string;
  category?: string;
  shared?: boolean;
  downloadUrl?: string;
  isLocal?: boolean;
}

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function FileShare() {
  const { user, profile } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from database on component mount
  useEffect(() => {
    if (user && profile) {
      loadUserFiles();
    } else {
      // Load sample files for non-authenticated users
      loadSampleFiles();
    }
  }, [user, profile]);

  const loadSampleFiles = () => {
    const sampleFiles = [
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
        category: "Lab Results",
        shared: true,
        downloadUrl: "#"
      },
      {
        id: "5",
        name: "Prescription - Dr. Carter.pdf",
        type: "file",
        size: "1.1 MB", 
        date: "Jan 08, 2025",
        category: "Prescriptions",
        shared: false,
        downloadUrl: "#"
      },
      {
        id: "6",
        name: "MRI Scan Results.pdf",
        type: "file",
        size: "15.3 MB",
        date: "Dec 20, 2024",
        category: "Imaging",
        shared: true,
        downloadUrl: "#"
      }
    ] as FileItem[];
    
    setFiles(sampleFiles);
    setLoading(false);
  };

  const loadUserFiles = async () => {
    setLoading(true);
    try {
      let allFiles = [...loadSampleFilesData()]; // Get sample files
      
      // Load uploaded files from localStorage
      const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      allFiles = [...uploadedFiles, ...allFiles];
      
      setFiles(allFiles);
      console.log('Loaded files for user:', profile?.id, allFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles(loadSampleFilesData());
    } finally {
      setLoading(false);
    }
  };

  const loadSampleFilesData = () => {
    return [
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
        category: "Lab Results",
        shared: true,
        downloadUrl: "#"
      },
      {
        id: "5",
        name: "Prescription - Dr. Carter.pdf",
        type: "file",
        size: "1.1 MB", 
        date: "Jan 08, 2025",
        category: "Prescriptions",
        shared: false,
        downloadUrl: "#"
      },
      {
        id: "6",
        name: "MRI Scan Results.pdf",
        type: "file",
        size: "15.3 MB",
        date: "Dec 20, 2024",
        category: "Imaging",
        shared: true,
        downloadUrl: "#"
      }
    ] as FileItem[];
  };

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setUploading(true);
    
    try {
      const newFiles: FileItem[] = [];
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        // Validate file size (25MB limit)
        if (file.size > 25 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 25MB limit.`,
            variant: "destructive"
          });
          continue;
        }

        // Validate file type
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported file type.`,
            variant: "destructive"
          });
          continue;
        }

        if (user && profile) {
          // Try to upload to Supabase storage first, fall back to localStorage
          try {
            const fileName = `${profile.id}/${Date.now()}-${file.name}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('medical-files')
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              throw uploadError;
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('medical-files')
              .getPublicUrl(fileName);

            // Create file record
            const newFile: FileItem = {
              id: Date.now().toString() + i,
              name: file.name,
              type: "file",
              size: formatFileSize(file.size),
              date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }),
              category: getCategoryFromFileName(file.name),
              shared: false,
              downloadUrl: publicUrl
            };
            
            newFiles.push(newFile);
          } catch (storageError) {
            console.error('Storage error, using localStorage:', storageError);
            // Fall back to localStorage for demo
            const fileData = await fileToBase64(file);
            const newFile: FileItem = {
              id: Date.now().toString() + i,
              name: file.name,
              type: "file",
              size: formatFileSize(file.size),
              date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }),
              category: getCategoryFromFileName(file.name),
              shared: false,
              downloadUrl: fileData,
              isLocal: true
            };
            
            // Store in localStorage
            const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
            existingFiles.push(newFile);
            localStorage.setItem('uploadedFiles', JSON.stringify(existingFiles));
            
            newFiles.push(newFile);
          }
        } else {
          // For non-authenticated users, use localStorage
          const fileData = await fileToBase64(file);
          const newFile: FileItem = {
            id: Date.now().toString() + i,
            name: file.name,
            type: "file",
            size: formatFileSize(file.size),
            date: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            category: getCategoryFromFileName(file.name),
            shared: false,
            downloadUrl: fileData,
            isLocal: true
          };
          
          // Store in localStorage
          const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
          existingFiles.push(newFile);
          localStorage.setItem('uploadedFiles', JSON.stringify(existingFiles));
          
          newFiles.push(newFile);
        }
      }

      setFiles(prev => [...newFiles, ...prev]);
      
      toast({
        title: "Upload successful",
        description: `${newFiles.length} file(s) uploaded successfully.`
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryFromFileName = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes('lab') || name.includes('blood') || name.includes('test')) return 'Lab Results';
    if (name.includes('prescription') || name.includes('rx')) return 'Prescriptions';
    if (name.includes('xray') || name.includes('mri') || name.includes('scan')) return 'Imaging';
    if (name.includes('report')) return 'Reports';
    return 'General';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileUpload(droppedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (file: FileItem) => {
    if (file.downloadUrl) {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${file.name}...`
      });
    } else {
      toast({
        title: "Download unavailable",
        description: "This file is not available for download.",
        variant: "destructive"
      });
    }
  };

  const toggleShare = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, shared: !file.shared }
        : file
    ));
    
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast({
        title: file.shared ? "File unshared" : "File shared",
        description: file.shared 
          ? `${file.name} is no longer shared.`
          : `${file.name} is now shared with your healthcare team.`
      });
    }
  };

  const deleteFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      
      // Clean up blob URL if it exists
      if (file.downloadUrl && file.downloadUrl.startsWith('blob:')) {
        URL.revokeObjectURL(file.downloadUrl);
      }
      
      toast({
        title: "File deleted",
        description: `${file.name} has been deleted.`
      });
    }
  };

  const openFolder = (folder: FileItem) => {
    if (folder.type === "folder") {
      toast({
        title: "Opening folder",
        description: `Opening ${folder.name}...`
      });
      
      // Simulate folder navigation - in a real app, this would navigate to folder contents
      setTimeout(() => {
        toast({
          title: "Folder opened",
          description: `Now viewing contents of ${folder.name}`
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Files & Documents
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload, share, and manage your medical records securely with your healthcare team.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 bg-card/90 backdrop-blur-sm border-border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload className="w-5 h-5 text-primary" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Share documents with your healthcare providers (PDF, JPG, PNG, DOC - Max 25MB each)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-primary bg-primary/10 scale-105' 
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDrag}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
            >
              <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : ''}`}>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {dragActive ? 'Drop files here!' : 'Drop files here to upload'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {dragActive ? 'Release to upload' : 'or click to browse files'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="border-border text-primary hover:bg-primary/10"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Grid */}
        <Card className="bg-card/90 backdrop-blur-sm border-border/20 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-foreground font-display">Your Documents</CardTitle>
            <CardDescription className="font-body">
              Browse, share, and manage your medical files and folders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    if (file.type === "folder") {
                      openFolder(file);
                    }
                  }}
                  className={`group relative p-6 border border-border/20 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 ${
                    file.type === "folder" ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="text-center space-y-4">
                    {file.type === "folder" ? (
                      <div className="relative">
                        <Folder className="w-16 h-16 mx-auto text-yellow-500 group-hover:text-yellow-600 transition-colors" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <FileText className="w-16 h-16 mx-auto text-primary" />
                        {file.shared && (
                          <Share className="w-6 h-6 absolute -top-2 -right-2 text-green-500 bg-background rounded-full p-1 border-2 border-green-500" />
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <p className="font-body font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                        {file.name}
                      </p>
                      
                      {file.category && (
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-accent/20 to-primary/20 text-primary border-0 font-body">
                          {file.category}
                        </Badge>
                      )}
                      
                      <div className="text-xs text-muted-foreground space-y-1 font-body">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {file.date}
                        </div>
                        {file.size && (
                          <div className="font-medium">{file.size}</div>
                        )}
                        {file.type === "file" && (
                          <div className={`text-xs ${file.shared ? 'text-green-600' : 'text-orange-600'}`}>
                            {file.shared ? '🟢 Shared' : '🟡 Private'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {file.type === "file" && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                        <div className="flex gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(file);
                            }}
                            className="text-xs border-accent/30 text-accent hover:bg-accent/10 font-body"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleShare(file.id);
                            }}
                            className={`text-xs font-body ${
                              file.shared 
                                ? 'border-green-300 text-green-600 hover:bg-green-50' 
                                : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                            }`}
                          >
                            <Share className="w-3 h-3 mr-1" />
                            {file.shared ? 'Unshare' : 'Share'}
                          </Button>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.id);
                          }}
                          className="w-full text-xs border-red-300 text-red-600 hover:bg-red-50 font-body"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                    
                    {file.type === "folder" && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openFolder(file);
                        }}
                        className="w-full opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10 font-body"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open Folder
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {files.length === 0 && (
              <div className="text-center py-16">
                <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-body text-lg mb-2">No files or folders found.</p>
                <p className="text-sm text-muted-foreground font-body">
                  Upload your first document to get started with secure file sharing.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
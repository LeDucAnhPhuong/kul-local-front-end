'use client';

import { DialogTrigger } from '@/components/ui/dialog';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useImportUserMutation } from '@/features/file/file.api';

interface UploadResult {
  message: string;
  skipped: {
    invalidRoles: string[];
    duplicateEmails: string[];
    duplicateInFile: string[];
  };
}

export default function ExcelUploadModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadUser] = useImportUserMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is Excel format
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate API call - replace with your actual endpoint
      const res = await uploadUser(formData).unwrap();

      setResult(res);
    } catch {
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];

      // Check if file is Excel format
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        setFile(null);
      }
    }
  };

  const resetModal = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setIsUploading(false);
    setIsDragOver(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetModal, 300); // Reset after modal closes
  };

  const getTotalSkipped = () => {
    if (!result) return 0;
    return (
      result.skipped.invalidRoles.length +
      result.skipped.duplicateEmails.length +
      result.skipped.duplicateInFile.length
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Excel File
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload User Data
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className=" flex-1">
          <div className="space-y-4">
            {!result ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="excel-file">Upload Excel File</Label>

                  {/* Drag & Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : file
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Input
                      id="excel-file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="space-y-4">
                      {file ? (
                        <>
                          <FileSpreadsheet className="mx-auto h-12 w-12 text-green-500" />
                          <div>
                            <p className="text-sm font-medium text-green-700">{file.name}</p>
                            <p className="text-xs text-green-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <p className="text-xs text-green-600">File ready to upload</p>
                        </>
                      ) : isDragOver ? (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-blue-500" />
                          <p className="text-sm font-medium text-blue-700">
                            Drop your Excel file here
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Drag & drop your Excel file here
                            </p>
                            <p className="text-xs text-gray-500 mt-1">or click to browse files</p>
                          </div>
                          <p className="text-xs text-gray-400">Supports .xlsx and .xls files</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {/* Success Message */}
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{result.message}</AlertDescription>
                </Alert>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                      {result.message.match(/\d+/)?.[0] || '0'}
                    </div>
                    <div className="text-sm text-green-700">Users Imported</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">{getTotalSkipped()}</div>
                    <div className="text-sm text-orange-700">Users Skipped</div>
                  </div>
                </div>

                {/* Error Details */}
                {getTotalSkipped() > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <h4 className="font-medium text-sm">Skipped Users Details:</h4>
                    <div className="flex-1">
                      <div className="h-full space-y-4">
                        {/* Duplicate Emails */}
                        {result.skipped.duplicateEmails.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs">
                                Duplicate Emails ({result.skipped.duplicateEmails.length})
                              </Badge>
                            </div>
                            <div className="grid gap-1 max-h-32 overflow-y-auto">
                              {result.skipped.duplicateEmails.map((email, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-200"
                                >
                                  {email}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Invalid Roles */}
                        {result.skipped.invalidRoles.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs">
                                Invalid Roles ({result.skipped.invalidRoles.length})
                              </Badge>
                            </div>
                            <div className="grid gap-1 max-h-32 overflow-y-auto">
                              {result.skipped.invalidRoles.map((role, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-200"
                                >
                                  {role}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.skipped.duplicateInFile.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs">
                                Duplicate in File ({result.skipped.duplicateInFile.length})
                              </Badge>
                            </div>
                            <div className="grid gap-1 max-h-32 overflow-y-auto">
                              {result.skipped.duplicateInFile.map((item, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-200"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          {!result ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!file || isUploading} className="gap-2">
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={resetModal}>
                Upload Another File
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

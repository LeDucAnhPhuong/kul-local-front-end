'use client';

import React  from 'react';

import type { ReactElement }  from 'react';
import { useState, useCallback }  from 'react';
import { Plus, Upload }  from 'lucide-react';
import { Button }  from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import {
Dialog,
DialogTrigger,
DialogContent,
DialogHeader,
DialogTitle,
DialogFooter,
}  from '@/components/ui/dialog';
import { toast }  from 'sonner';
import { useCreateNewsMutation, useGetNewsForStudentQuery }  from './news.api';
import { useUploadImageMutation }  from '@/features/file/file.api';
import { stripHtml }  from '@/utils/stripHTML';
import DataTable  from '@/components/data-table/data-table';
import CustomEditor  from '@/components/ui/custom-editor';
import { columns }  from '../../columns/news.columns';
import useRouter  from '@/hooks/use-router';

export interface NewsResult {
score: number;
feedback: string;
createdBy: string;
updatedBy: string;
createdAt: string;
updatedAt: string;
}

export type News = {
id: number;
title: string;
content: string;
imageUrl?: string;
class_id: number;
user_id: number;
isActive: boolean;
createdBy: string;
updatedBy: string;
createdAt: string;
updatedAt: string;
date?: string;
source?: string;
result?: NewsResult;
};

const NewsForm = React.memo(
({
  newTitle,
  setNewTitle,
  newImage,
  newContent,
  setNewContent,
  handleImageUpload,
}: {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newImage: string;
  newContent: string;
  setNewContent: (value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): ReactElement => (
  <div className="space-y-6">
    {/* Title */}
    <div className="space-y-2">
      <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
        News Title <span className="text-red-500">*</span>
      </Label>
      <Input
        id="title"
        placeholder="Enter news title..."
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        autoComplete="off"
      />
      <div className="text-xs text-right text-gray-500">{newTitle.length}/100 characters</div>
    </div>

    {/* Date and Source */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2"></div>

    {/* Image Upload */}
    <div className="space-y-2">
      <Label htmlFor="image" className="text-sm font-semibold text-gray-700">
        Image
      </Label>
      <div className="p-2 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400">
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <label
          htmlFor="image"
          className="flex flex-col items-center justify-center space-y-3 cursor-pointer"
        >
          {newImage ? (
            <img
              src={newImage || '/placeholder.svg'}
              alt="Preview"
              className="object-cover max-h-[400px] rounded-lg shadow-md"
            />
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </>
          )}
        </label>
      </div>
    </div>

    {/* Rich Text Editor */}
    <CustomEditor
      content={newContent}
      onChange={(value) => {
        console.log('value :>> ', value);
        setNewContent(value);
      }}
    />
  </div>
),
);

export default function NewsTable() {
const router = useRouter();

const { newsData, isFetching } = useGetNewsForStudentQuery(undefined, {
  selectFromResult: ({ data, isFetching }) => ({
    newsData:
      data?.data
        ?.filter((item: News) => item?.isActive)
        ?.sort((a: News, b: News) => (new Date(b.createdAt) < new Date(a.createdAt) ? -1 : 1)) ||
      [],
    isFetching,
  }),
});

const [createNews, { isLoading }] = useCreateNewsMutation();
const [uploadImage] = useUploadImageMutation();

const [open, setOpen] = useState(false);

// Form states
const [newTitle, setNewTitle] = useState('');
const [newContent, setNewContent] = useState('');
const [newImage, setNewImage] = useState('');

console.log('newImage :>> ', newContent);

// Rich text editor states

const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  try {
    if (file) {
      var formdata = new FormData();
      formdata.append('file', file);
      const res = await uploadImage(formdata).unwrap();
      setNewImage(res?.url);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
  }
}, []);

const formatDate = useCallback((date: Date) => {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}, []);

const handleAddNews = useCallback(async () => {
  const plainTextContent = stripHtml(newContent);
  if (!newTitle.trim() || !plainTextContent.trim()) {
    toast.error('Please fill in both Title and Content');
    return;
  }
  try {
    await createNews({
      title: newTitle,
      content: newContent,
      imageUrl: newImage || undefined,
    });
    toast.success('News created successfully');
    setOpen(false);
  } catch (error) {
    console.error('Error creating news:', error);
  }
}, [newTitle, newContent, newImage, formatDate, stripHtml]);

const handleView = useCallback((news: News) => {
  router.push(`/news/${news.id}`);
}, []);

return (
  <div className="p-6 bg-white border dark:bg-background rounded-xl border-stone-200 dark:border-stone-800">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">List News Title</h1>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-red-500 shadow-md hover:bg-red-600">
            <Plus className="w-4 h-4 mr-2" />
            Write News
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 mb-0 -m-6 text-white bg-gradient-to-r from-red-500 to-red-600">
            <DialogTitle className="text-xl font-semibold text-center">Write News</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <NewsForm
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newImage={newImage}
              newContent={newContent}
              setNewContent={setNewContent}
              handleImageUpload={handleImageUpload}
            />
          </div>
          <DialogFooter className="gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-8 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNews}
              className="px-8 bg-green-500 shadow-md hover:bg-green-600"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <DataTable
      data={newsData}
      columns={columns}
      isLoading={isFetching}
      onRowClick={({ data }) => handleView(data)}
    />
  </div>
);
}

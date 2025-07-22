import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
const CheckingModal = ({ isOpen, content, setOpen }: any) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Checking</DialogTitle>
          <DialogDescription>
            Review the AI-generated checking for the news article.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span>AI Generated: {content?.AI_generate}%</span>
            <span>AI Check Copyright: {content?.copy_right}%</span>
          </div>
          <div className="grid gap-3"></div>
        </div>
        <DialogFooter>
          <DialogClose asChild></DialogClose>
          <Button onClick={() => setOpen(null)}>Oke</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckingModal;

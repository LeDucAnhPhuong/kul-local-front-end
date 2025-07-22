import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useGradeSubmissionMutation } from '../api.teacher';

const GradeAssignment = ({
  grading,
  setGrading,
  score,
  setScore,
  feedback,
  setFeedback,
  handleSaveGrade,
}: {
  grading: string | null;
  setGrading: (grading: string | null) => void;
  score: string;
  setScore: (score: string) => void;
  feedback: string;
  setFeedback: (feedback: string) => void;
  handleSaveGrade: () => void;
}) => {
  return (
    <Dialog open={!!grading} onOpenChange={() => setGrading(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="score">Score</Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Enter score (e.g., 8.5)"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write feedback here"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setGrading(null)}>
            Cancel
          </Button>
          <Button onClick={handleSaveGrade}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GradeAssignment;

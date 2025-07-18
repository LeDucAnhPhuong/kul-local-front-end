'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RotateCcw, ArrowRight, GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50 z-50' : ''}`}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default function PairKeyQuestion({ question, questionIndex, answer, updateAnswer }: any) {
  const originalLeftItems = question.pairs.left;
  const originalRightItems = question.pairs.right;

  const [leftItems, setLeftItems] = useState<string[]>(() => {
    if (answer?.leftOrder && answer?.leftOrder?.length === originalLeftItems.length) {
      return answer?.leftOrder;
    }
    return [...originalLeftItems];
  });

  const [rightItems, setRightItems] = useState<string[]>(() => {
    if (answer?.rightOrder && answer?.rightOrder.length === originalRightItems.length) {
      return answer?.rightOrder;
    }
    return [...originalRightItems];
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Update answer when items change
  useEffect(() => {
    const matchedPairs = leftItems.map((leftItem, index) => ({
      left: leftItem,
      right: rightItems[index] || '',
    }));

    updateAnswer(questionIndex, {
      matchedPairs,
      leftOrder: leftItems,
      rightOrder: rightItems,
    });
  }, [JSON.stringify(leftItems), JSON.stringify(rightItems), questionIndex]);

  const handleDragEnd = (event: DragEndEvent, side: 'left' | 'right') => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const items = side === 'left' ? leftItems : rightItems;
      const setItems = side === 'left' ? setLeftItems : setRightItems;

      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const resetOrder = () => {
    setLeftItems([...originalLeftItems]);
    setRightItems([...originalRightItems]);
  };

  const shuffleItems = (side: 'left' | 'right') => {
    const items = side === 'left' ? leftItems : rightItems;
    const setItems = side === 'left' ? setLeftItems : setRightItems;

    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  useEffect(() => {
    shuffleItems('left');
    shuffleItems('right');
  }, [originalLeftItems, originalRightItems]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold leading-relaxed">{question.questionText}</h3>
      <p className="text-sm text-muted-foreground">
        Drag and drop items within each column to match them by position. Items at the same position
        will be paired together.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Left Items</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shuffleItems('left')}
              className="text-xs"
            >
              Shuffle
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, 'left')}
          >
            <SortableContext items={leftItems} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {leftItems.map((item, index) => (
                  <SortableItem key={item} id={item}>
                    <div className="p-4 border-2 rounded-lg cursor-move transition-all hover:border-blue-400 bg-blue-50 border-blue-300 dark:bg-blue-950/20 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-blue-900 dark:text-blue-100">
                            {item}
                          </span>
                        </div>
                        <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">
                          Pos {index + 1}
                        </span>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Matching Visualization */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-center block">Current Matches</Label>
          <div className="space-y-2">
            {leftItems.map((leftItem, index) => (
              <div
                key={`match-${index}`}
                className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
              >
                <div className="flex items-center space-x-2 text-sm">
                  <span
                    className="font-medium text-blue-600 truncate max-w-[80px]"
                    title={leftItem}
                  >
                    {leftItem}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span
                    className="font-medium text-orange-600 truncate max-w-[80px]"
                    title={rightItems[index] || '—'}
                  >
                    {rightItems[index] || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Right Items</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shuffleItems('right')}
              className="text-xs"
            >
              Shuffle
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, 'right')}
          >
            <SortableContext items={rightItems} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {rightItems.map((item, index) => (
                  <SortableItem key={item} id={item}>
                    <div className="p-4 border-2 rounded-lg cursor-move transition-all hover:border-orange-400 bg-orange-50 border-orange-300 dark:bg-orange-950/20 dark:border-orange-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-4 h-4 text-orange-400" />
                          <span className="font-medium text-orange-900 dark:text-orange-100">
                            {item}
                          </span>
                        </div>
                        <span className="text-xs bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded">
                          Pos {index + 1}
                        </span>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Drag items within columns to reorder them. {leftItems.length} position-based pairs will be
          created.
        </div>
        <Button variant="outline" size="sm" onClick={resetOrder}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Order
        </Button>
      </div>

      {/* Detailed Matches */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <Label className="text-sm font-semibold">Position-based Matches:</Label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {leftItems.map((leftItem, index) => (
            <div
              key={`detail-${index}`}
              className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border text-sm"
            >
              <span>
                <span className="font-medium text-blue-600">#{index + 1}</span>{' '}
                <span className="text-blue-800 dark:text-blue-200">{leftItem}</span>
              </span>
              <ArrowRight className="w-3 h-3 text-gray-400 mx-2" />
              <span>
                <span className="text-orange-800 dark:text-orange-200">
                  {rightItems[index] || '—'}
                </span>{' '}
                <span className="font-medium text-orange-600">#{index + 1}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

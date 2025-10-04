"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuestionFlowFilters } from "@/requests/question-flow.requests";

interface QuestionFilterModalProps {
  currentFilters: QuestionFlowFilters;
  onFiltersChange: (filters: QuestionFlowFilters) => void;
  availableChapters: Array<{
    id: number;
    name: string;
    parent_id: number | null;
  }>;
  availableDifficulties: Array<{ id: number; name: string }>;
  parentChapterId: number | null;
}

export function QuestionFilterModal({
  currentFilters,
  onFiltersChange,
  availableChapters,
  availableDifficulties,
  parentChapterId,
}: QuestionFilterModalProps) {
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] =
    useState<QuestionFlowFilters>(currentFilters);
  const [isOpen, setIsOpen] = useState(false);

  // Filter chapters to show only sub-chapters of the current discipline
  const subChapters = availableChapters.filter(
    (chapter) => chapter.parent_id === parentChapterId
  );

  // Update local filters when currentFilters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleChapterToggle = (chapterId: number) => {
    setLocalFilters((prev) => {
      const currentChapterIds = prev.chapter_ids || [];
      const isSelected = currentChapterIds.includes(chapterId);

      if (isSelected) {
        return {
          ...prev,
          chapter_ids: currentChapterIds.filter((id) => id !== chapterId),
        };
      } else {
        return {
          ...prev,
          chapter_ids: [...currentChapterIds, chapterId],
        };
      }
    });
  };

  const handleDifficultyToggle = (difficultyId: number) => {
    setLocalFilters((prev) => {
      const currentDifficultyIds = prev.difficulty_ids || [];
      const isSelected = currentDifficultyIds.includes(difficultyId);

      if (isSelected) {
        return {
          ...prev,
          difficulty_ids: currentDifficultyIds.filter(
            (id) => id !== difficultyId
          ),
        };
      } else {
        return {
          ...prev,
          difficulty_ids: [...currentDifficultyIds, difficultyId],
        };
      }
    });
  };

  const handleTypeToggle = (type: "single" | "multiple") => {
    setLocalFilters((prev) => ({
      ...prev,
      type: prev.type === type ? undefined : type,
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    // When resetting, preserve the parent chapter ID if it exists
    const resetFilters: QuestionFlowFilters = {};

    // If we have a parent chapter ID from URL, maintain it in the filters
    if (parentChapterId !== null) {
      resetFilters.chapter_ids = [parentChapterId];
    }

    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Chapters */}
      {subChapters.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Capitole</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {subChapters.map((chapter) => (
              <div key={chapter.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`chapter-${chapter.id}`}
                  checked={(localFilters.chapter_ids || []).includes(
                    chapter.id
                  )}
                  onCheckedChange={() => handleChapterToggle(chapter.id)}
                />
                <label
                  htmlFor={`chapter-${chapter.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {chapter.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulties */}
      {availableDifficulties.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Dificultăți</h3>
          <div className="space-y-2">
            {availableDifficulties.map((difficulty) => (
              <div key={difficulty.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`difficulty-${difficulty.id}`}
                  checked={(localFilters.difficulty_ids || []).includes(
                    difficulty.id
                  )}
                  onCheckedChange={() => handleDifficultyToggle(difficulty.id)}
                />
                <label
                  htmlFor={`difficulty-${difficulty.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {difficulty.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Type */}
      <div>
        <h3 className="text-sm font-medium mb-3">Tip întrebare</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-single"
              checked={localFilters.type === "single"}
              onCheckedChange={() => handleTypeToggle("single")}
            />
            <label
              htmlFor="type-single"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Răspuns unic
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-multiple"
              checked={localFilters.type === "multiple"}
              onCheckedChange={() => handleTypeToggle("multiple")}
            />
            <label
              htmlFor="type-multiple"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Răspunsuri multiple
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={handleApplyFilters} className="flex-1">
          Aplică filtrele
        </Button>
        <Button
          onClick={handleResetFilters}
          variant="outline"
          className="flex-1">
          Resetează
        </Button>
      </div>
    </div>
  );

  const TriggerIcon = (
    <Button
      variant="ghost"
      className="h-auto w-auto p-2 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg">
      <SlidersHorizontal
        className="text-purple-600 dark:text-purple-400"
        style={{
          width: isMobile ? 24 : 28,
          height: isMobile ? 24 : 28,
        }}
      />
    </Button>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>{TriggerIcon}</DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filtrează întrebările</p>
        </TooltipContent>
      </Tooltip>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">
            Filtrează întrebările
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          <FilterContent />
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{TriggerIcon}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filtrează întrebările</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Filtrează întrebările
          </DialogTitle>
        </DialogHeader>
        <FilterContent />
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { Check, ChevronRight, ChevronsUpDown, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface HierarchicalOption {
  id: string | number;
  name: string;
  parent_id: string | number | null;
  order: number;
}

type SingleValue = string | number | null;
type MultipleValue = Array<string | number>;

interface BaseHierarchicalAutocompleteProps {
  options: HierarchicalOption[];
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  /**
   * Show expanded/collapsed state for parent items
   * @default true
   */
  expandable?: boolean
  /**
   * Select parent and all children when a parent is selected (only in multiple mode)
   * @default false
   */;
  selectChildrenWithParent?: boolean;
  /**
   * Indent child items to show hierarchy
   * @default true
   */
  showIndentation?: boolean;
  /**
   * Initial expanded state for parent items
   * @default true
   */
  defaultExpanded?: boolean;
}

interface SingleHierarchicalAutocompleteProps
  extends BaseHierarchicalAutocompleteProps {
  multiple?: false;
  value?: SingleValue;
  onChange?: (value: SingleValue) => void;
}

interface MultipleHierarchicalAutocompleteProps
  extends BaseHierarchicalAutocompleteProps {
  multiple: true;
  value?: MultipleValue;
  onChange?: (value: MultipleValue) => void;
}

export type HierarchicalAutocompleteProps =
  | SingleHierarchicalAutocompleteProps
  | MultipleHierarchicalAutocompleteProps;

// Create hierarchical structure
interface HierarchicalNode extends HierarchicalOption {
  children: HierarchicalNode[];
  depth: number;
  isExpanded: boolean;
}

export function HierarchicalAutocomplete(props: HierarchicalAutocompleteProps) {
  const {
    options,
    placeholder = "Select item...",
    emptyMessage = "No matching items found",
    disabled = false,
    className,
    expandable = true,
    selectChildrenWithParent = false,
    showIndentation = true,
    defaultExpanded = true,
  } = props;

  const multiple = props.multiple ?? false;
  const value = props.value;
  const onChange = props.onChange;

  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Track expanded state of parent nodes
  const [expandedItems, setExpandedItems] = React.useState<
    Record<string | number, boolean>
  >({});

  // Convert options to hierarchical structure
  const hierarchyMap = React.useMemo(() => {
    const map = new Map<string | number, HierarchicalNode>();
    const rootNodes: HierarchicalNode[] = [];

    // Initialize nodes
    options.forEach((option) => {
      map.set(option.id, {
        ...option,
        children: [],
        depth: 0,
        isExpanded: defaultExpanded,
      });
    });

    // Build parent-child relationships
    options.forEach((option) => {
      const node = map.get(option.id)!;

      if (option.parent_id === null) {
        rootNodes.push(node);
      } else {
        const parentNode = map.get(option.parent_id);
        if (parentNode) {
          parentNode.children.push(node);
          node.depth = parentNode.depth + 1;
        } else {
          // Handle orphaned nodes (parent doesn't exist)
          rootNodes.push(node);
        }
      }
    });

    // Sort children by order property
    rootNodes.sort((a, b) => a.order - b.order);
    map.forEach((node) => {
      node.children.sort((a, b) => a.order - b.order);
    });

    return { map, rootNodes };
  }, [options, defaultExpanded]);

  // Flatten hierarchical structure for rendering
  const flattenedItems = React.useMemo(() => {
    const result: HierarchicalNode[] = [];

    const traverse = (nodes: HierarchicalNode[]) => {
      nodes.forEach((node) => {
        const isExpanded = expandedItems[node.id] ?? node.isExpanded;
        result.push({ ...node, isExpanded });

        if (isExpanded && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(hierarchyMap.rootNodes);
    return result;
  }, [hierarchyMap.rootNodes, expandedItems]);

  // Convert single value to array for consistent internal handling
  const selectedValues = React.useMemo(() => {
    if (multiple) {
      // For multiple selection, ensure we have an array
      return Array.isArray(value) ? value : [];
    } else {
      // For single selection, convert to array for internal consistency
      return value !== null && value !== undefined ? [value] : [];
    }
  }, [value, multiple]);

  // Find the selected options for display
  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => selectedValues.includes(option.id));
  }, [selectedValues, options]);
  // Get all child IDs for a parent
  const getAllChildrenIds = React.useCallback(
    (parentId: string | number): (string | number)[] => {
      const result: (string | number)[] = [];
      const parent = hierarchyMap.map.get(parentId);

      if (!parent) return result;

      const traverse = (node: HierarchicalNode) => {
        node.children.forEach((child) => {
          result.push(child.id);
          traverse(child);
        });
      };

      traverse(parent);
      return result;
    },
    [hierarchyMap.map]
  );

  // Get all parent IDs for a child (up to root)
  const getAllParentIds = React.useCallback(
    (childId: string | number): (string | number)[] => {
      const result: (string | number)[] = [];
      const option = options.find((opt) => opt.id === childId);

      if (!option) return result;

      let currentParentId = option.parent_id;
      while (currentParentId !== null) {
        result.push(currentParentId);
        const parent = options.find((opt) => opt.id === currentParentId);
        currentParentId = parent?.parent_id ?? null;
      }

      return result;
    },
    [options]
  );

  // Check if a parent has any selected children
  const hasSelectedChildren = React.useCallback(
    (parentId: string | number): boolean => {
      const childrenIds = getAllChildrenIds(parentId);
      return childrenIds.some((childId) => selectedValues.includes(childId));
    },
    [getAllChildrenIds, selectedValues]
  );

  const toggleExpand = (nodeId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [nodeId]: !(prev[nodeId] ?? defaultExpanded),
    }));
  };
  const handleSelect = (optionId: string | number) => {
    if (multiple) {
      // Multiple selection mode
      const typedOnChange = onChange as
        | ((value: MultipleValue) => void)
        | undefined;
      if (selectedValues.includes(optionId)) {
        // Check if this is a parent with selected children - prevent deselection
        if (hasSelectedChildren(optionId)) {
          toast.error("Nu poți deselecta un părinte care are copii selectați");
          return;
        }

        // Remove if already selected
        let newValues = selectedValues.filter((id) => id !== optionId);

        // Also remove children if parent is deselected and selectChildrenWithParent is true
        if (selectChildrenWithParent) {
          const childrenIds = getAllChildrenIds(optionId);
          newValues = newValues.filter(
            (id) => !childrenIds.includes(id as any)
          );
        }

        typedOnChange?.(newValues as any);
      } else {
        // Add to selection
        const newValues = [...selectedValues, optionId];

        // Auto-select all parents when selecting a child
        const parentIds = getAllParentIds(optionId);
        parentIds.forEach((parentId) => {
          if (!newValues.includes(parentId)) {
            newValues.push(parentId);
          }
        });

        // Also add all children if selectChildrenWithParent is true
        if (selectChildrenWithParent) {
          const childrenIds = getAllChildrenIds(optionId);
          childrenIds.forEach((childId) => {
            if (!newValues.includes(childId)) {
              newValues.push(childId);
            }
          });
        }

        typedOnChange?.(newValues as any);
      }
      // Don't close popover in multiple mode
    } else {
      // Single selection mode
      const typedOnChange = onChange as
        | ((value: SingleValue) => void)
        | undefined;
      typedOnChange?.(optionId);
      setSearchQuery("");
      setOpen(false);
    }
  };
  const handleRemove = (optionId: string | number) => {
    if (multiple) {
      // Multiple selection mode
      const typedOnChange = onChange as
        | ((value: MultipleValue) => void)
        | undefined;

      // Check if this is a parent with selected children - prevent removal
      if (hasSelectedChildren(optionId)) {
        toast.error("Nu poți deselecta un părinte care are copii selectați");
        return;
      }

      let newValues = selectedValues.filter((id) => id !== optionId);

      // Also remove children if parent is deselected and selectChildrenWithParent is true
      if (selectChildrenWithParent) {
        const childrenIds = getAllChildrenIds(optionId);
        newValues = newValues.filter((id) => !childrenIds.includes(id as any));
      }

      typedOnChange?.(newValues as any);
    } else {
      // Single selection mode
      const typedOnChange = onChange as
        | ((value: SingleValue) => void)
        | undefined;
      typedOnChange?.(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      multiple &&
      e.key === "Backspace" &&
      !searchQuery &&
      selectedValues.length > 0
    ) {
      // Remove the last item when pressing backspace with an empty search
      const typedOnChange = onChange as
        | ((value: MultipleValue) => void)
        | undefined;
      const newValues = [...selectedValues];
      newValues.pop();
      typedOnChange?.(newValues as any);
    }
  };

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return flattenedItems;

    // Find items that match the search query
    const matchingItems = new Set<string | number>();

    options.forEach((option) => {
      if (option.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        matchingItems.add(option.id);

        // Add all parents of matching items
        let currentParentId = option.parent_id;
        while (currentParentId !== null) {
          matchingItems.add(currentParentId);
          const parent = options.find((p) => p.id === currentParentId);
          currentParentId = parent?.parent_id ?? null;
        }
      }
    });

    // Return only the matching items and their parents
    return flattenedItems.filter((item) => matchingItems.has(item.id));
  }, [flattenedItems, options, searchQuery]);

  // Display content for the button
  const buttonContent = () => {
    if (!selectedValues.length) {
      return placeholder;
    }

    if (!multiple) {
      // Single selection
      return selectedOptions[0]?.name || placeholder;
    } // Multiple selection - show badges
    return (
      <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
        {selectedOptions.map((option) => {
          const isParentWithSelectedChildren = hasSelectedChildren(option.id);

          return (
            <Badge
              key={option.id}
              variant={isParentWithSelectedChildren ? "default" : "secondary"}
              className={cn(
                "flex items-center gap-1 max-w-[150px] truncate",
                isParentWithSelectedChildren &&
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              )}>
              <span className="truncate">{option.name}</span>
              {isParentWithSelectedChildren ? (
                <span className="text-xs opacity-70">(obligatoriu)</span>
              ) : (
                <div
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.id);
                  }}
                  aria-label={`Remove ${option.name}`}>
                  <X className="h-3 w-3" />
                </div>
              )}
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          type="button"
          className={cn(
            "w-full justify-between min-h-10",
            multiple && selectedValues.length > 0 ? "h-auto" : "",
            className
          )}>
          <span className="flex-1 text-left flex items-center gap-1 flex-wrap">
            {buttonContent()}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Caută ${placeholder.toLowerCase()}...`}
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleKeyDown}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {" "}
            {filteredItems.map((item) => {
              const isSelected = selectedValues.includes(item.id);
              const isParentWithSelectedChildren =
                isSelected && hasSelectedChildren(item.id);

              return (
                <CommandItem
                  key={item.id}
                  value={item.id.toString()}
                  onSelect={() => handleSelect(item.id)}
                  className={cn(
                    "cursor-pointer",
                    showIndentation &&
                      item.depth > 0 &&
                      "pl-[calc(1rem*var(--depth))]",
                    isParentWithSelectedChildren &&
                      "bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-500"
                  )}
                  style={
                    showIndentation
                      ? ({ "--depth": item.depth } as React.CSSProperties)
                      : undefined
                  }>
                  {expandable && item.children.length > 0 && (
                    <div
                      onClick={(e) => toggleExpand(item.id, e)}
                      className="mr-1 p-1 rounded-sm hover:bg-accent hover:text-accent-foreground"
                      aria-label={item.isExpanded ? "Collapse" : "Expand"}>
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 transition-transform",
                          item.isExpanded && "transform rotate-90"
                        )}
                      />
                    </div>
                  )}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0",
                      isParentWithSelectedChildren && "text-blue-600"
                    )}
                  />
                  <span
                    className={cn(
                      isParentWithSelectedChildren &&
                        "font-medium text-blue-700 dark:text-blue-300"
                    )}>
                    {item.name}
                  </span>
                  {isParentWithSelectedChildren && (
                    <span className="ml-auto text-xs text-blue-600 dark:text-blue-400 opacity-70">
                      (obligatoriu)
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

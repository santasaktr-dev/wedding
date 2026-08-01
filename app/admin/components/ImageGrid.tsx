"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { GalleryImage } from "../../../lib/cms/types";
import { getLocalizedText } from "../../../lib/cms/validation";

type ImageGridProps = {
  images: GalleryImage[];
  isDeleting?: boolean;
  sortMode?: boolean;
  onDelete: (image: GalleryImage) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onReorder: (activeId: string, overId: string) => void;
};

type SortableImageCardProps = {
  image: GalleryImage;
  index: number;
  isDeleting: boolean;
  sortMode: boolean;
  imagesLength: number;
  onDelete: (image: GalleryImage) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

function SortableImageCard({ image, index, imagesLength, isDeleting, onDelete, onMove, sortMode }: SortableImageCardProps) {
  const caption = getLocalizedText(image.caption, "en");
  const alt = getLocalizedText(image.alt, "en") || caption;
  const dragLabel = caption || alt || "image";
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({
    id: image.id,
  });

  return (
    <article
      className={`border border-[#d6c8a5] bg-white p-3 ${isDragging ? "relative z-10 opacity-70 shadow-[0_18px_45px_rgba(10,31,68,0.18)]" : ""}`}
      ref={setNodeRef}
      {...(sortMode ? attributes : {})}
      {...(sortMode ? listeners : {})}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className={`relative aspect-[4/5] overflow-hidden bg-[#0a1f44]/10 ${sortMode ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}>
        <Image alt={alt} className="object-contain" fill sizes="(min-width: 1024px) 25vw, 50vw" src={image.publicUrl} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#0a1f44]">{caption}</p>
          <p className="mt-1 text-xs text-[#3e4d3a]">Sort order {image.sortOrder + 1}</p>
        </div>
        {sortMode ? (
          <span className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-[#0a1f44] bg-[#fbf8f0] px-3 text-xs font-semibold text-[#0a1f44]">
            <GripVertical aria-hidden="true" size={18} strokeWidth={1.8} />
            Move card
          </span>
        ) : (
        <button
          aria-label={`Drag ${dragLabel} to reorder`}
          className="inline-flex min-h-11 shrink-0 cursor-grab items-center justify-center gap-2 border border-[#d6c8a5] px-3 text-xs font-semibold text-[#0a1f44] transition hover:border-[#0a1f44] hover:bg-[#fbf8f0] active:cursor-grabbing touch-none"
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden="true" size={18} strokeWidth={1.8} />
          <span className="hidden sm:inline">Drag</span>
        </button>
        )}
      </div>
      {!sortMode ? <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="border border-[#d6c8a5] px-2 py-2 text-xs font-semibold text-[#0a1f44] transition hover:border-[#0a1f44] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          type="button"
        >
          Move up
        </button>
        <button
          className="border border-[#d6c8a5] px-2 py-2 text-xs font-semibold text-[#0a1f44] transition hover:border-[#0a1f44] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={index === imagesLength - 1}
          onClick={() => onMove(index, index + 1)}
          type="button"
        >
          Move down
        </button>
        <button
          aria-label={`Delete ${caption || alt || "image"}`}
          className="col-span-2 border border-[#8d2f2f] px-2 py-2 text-xs font-semibold text-[#8d2f2f] transition hover:bg-[#8d2f2f] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          disabled={isDeleting}
          onClick={() => onDelete(image)}
          type="button"
        >
          Delete
        </button>
      </div>
      : null}
    </article>
  );
}

export function ImageGrid({ images, isDeleting = false, onDelete, onMove, onReorder, sortMode = false }: ImageGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (images.length === 0) {
    return (
      <div className="border border-dashed border-[#d6c8a5] bg-[#fbf8f0] p-6 text-sm text-[#3e4d3a]">
        No images in this album yet.
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (!event.over || event.active.id === event.over.id) {
      return;
    }

    onReorder(String(event.active.id), String(event.over.id));
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));
  const activeImage = images.find((image) => image.id === activeId);

  return (
    <DndContext collisionDetection={closestCenter} onDragCancel={() => setActiveId(null)} onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
      <SortableContext items={images.map((image) => image.id)} strategy={rectSortingStrategy}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <SortableImageCard
              image={image}
              imagesLength={images.length}
              index={index}
              isDeleting={isDeleting}
              key={image.id}
              onDelete={onDelete}
              onMove={onMove}
              sortMode={sortMode}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={null}>
        {activeImage ? (
          <div className="w-44 overflow-hidden border border-[#0a1f44] bg-white p-2 shadow-[0_20px_45px_rgba(10,31,68,0.28)] rotate-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#0a1f44]/10">
              <Image alt="" className="object-contain" fill sizes="176px" src={activeImage.publicUrl} />
            </div>
            <p className="mt-2 truncate text-xs font-semibold text-[#0a1f44]">{getLocalizedText(activeImage.caption, "en") || "Photo"}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

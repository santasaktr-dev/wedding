"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
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

import type { GalleryImage } from "../../../lib/cms/types";
import { getLocalizedText } from "../../../lib/cms/validation";

type ImageGridProps = {
  images: GalleryImage[];
  isDeleting?: boolean;
  onDelete: (image: GalleryImage) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onReorder: (activeId: string, overId: string) => void;
};

type SortableImageCardProps = {
  image: GalleryImage;
  index: number;
  isDeleting: boolean;
  imagesLength: number;
  onDelete: (image: GalleryImage) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

function SortableImageCard({ image, index, imagesLength, isDeleting, onDelete, onMove }: SortableImageCardProps) {
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
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0a1f44]/10">
        <Image alt={alt} className="object-contain" fill sizes="(min-width: 1024px) 25vw, 50vw" src={image.publicUrl} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#0a1f44]">{caption}</p>
          <p className="mt-1 text-xs text-[#3e4d3a]">Sort order {image.sortOrder + 1}</p>
        </div>
        <button
          aria-label={`Drag ${dragLabel} to reorder`}
          className="inline-flex size-9 shrink-0 cursor-grab items-center justify-center border border-[#d6c8a5] text-[#0a1f44] transition hover:border-[#0a1f44] active:cursor-grabbing"
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden="true" size={16} strokeWidth={1.8} />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
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
    </article>
  );
}

export function ImageGrid({ images, isDeleting = false, onDelete, onMove, onReorder }: ImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
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
    if (!event.over || event.active.id === event.over.id) {
      return;
    }

    onReorder(String(event.active.id), String(event.over.id));
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
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
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

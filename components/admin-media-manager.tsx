"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  medium: string;
  year: string;
  show_reel?: boolean;
  reel_only?: boolean;
}

export function AdminMediaManager() {
  const { data: session } = useSession();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const [imgRes, vidRes] = await Promise.all([
        fetch("/api/image?all=1"),
        fetch("/api/video?all=1"),
      ]);
      const [imgs, vids] = await Promise.all([imgRes.json(), vidRes.json()]);
      setMedia([...imgs, ...vids]);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMedia();
    }
  }, [session]);

  if (!session) return null;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-600">Caricamento media...</div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-wood-light">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-playfair font-bold text-center">Gestione Media</h2>
        <div className="space-y-6">
          {media.map((item) => (
            <MediaEditor key={item.id} item={item} onUpdated={fetchMedia} />
          ))}
        </div>
      </div>
    </section>
  );
}

function getInitialVisibility(item: MediaItem): string {
  if (item.show_reel) {
    return item.reel_only ? "reels" : "both";
  }
  return item.reel_only ? "none" : "gallery";
}

function visibilityToFlags(v: string) {
  switch (v) {
    case "gallery":
      return { show_reel: false, reel_only: false };
    case "reels":
      return { show_reel: true, reel_only: true };
    case "both":
      return { show_reel: true, reel_only: false };
    case "none":
      return { show_reel: false, reel_only: true };
    default:
      return { show_reel: false, reel_only: false };
  }
}

function MediaEditor({
  item,
  onUpdated,
}: {
  item: MediaItem;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [alt, setAlt] = useState(item.alt);
  const [year, setYear] = useState(item.year);
  const [visibility, setVisibility] = useState<string>(
    getInitialVisibility(item),
  );
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const flags = visibilityToFlags(visibility);
    await fetch(`/api/${item.medium === "image" ? "image" : "video"}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        alt,
        year,
        ...flags,
      }),
    });
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch(`/api/${item.medium === "image" ? "image" : "video"}/${item.id}`, {
        method: "PUT",
        body: fd,
      });
      setFile(null);
    }
    setSaving(false);
    onUpdated();
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 flex items-center justify-center">
          {item.medium === "image" ? (
            <Image
              src={`/api/image/${item.id}`}
              alt={alt}
              width={200}
              height={150}
              className="object-cover"
            />
          ) : (
            <video
              src={`/api/video/${item.id}`}
              className="w-[200px] h-[150px] object-cover"
              controls
            />
          )}
        </div>
        <CardContent className="w-full md:w-2/3 space-y-2 p-0">
          <input
            className="w-full border rounded px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo"
          />
          <textarea
            className="w-full border rounded px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione"
          />
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Alt"
            />
            <input
              className="w-24 border rounded px-2 py-1"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Anno"
            />
          </div>
          <select
            className="w-full border rounded px-2 py-1"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="gallery">Solo galleria</option>
            <option value="reels">Solo reels</option>
            <option value="both">Entrambi</option>
            <option value="none">Nessuno</option>
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          <Button onClick={save} disabled={saving} className="mt-2">
            Salva
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}


import { getCollection } from "./mongodb";

export type ImageRecord = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  medium: string;
  year: string;
  show_reel?: boolean;
  reel_only?: boolean;
};

const collectionName = "images";

export const getImages = async (includeReelOnly = false): Promise<ImageRecord[]> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const filter = includeReelOnly
    ? { medium: "image" }
    : { medium: "image", $or: [{ reel_only: { $ne: true } }, { reel_only: { $exists: false } }] };
  return collection.find(filter).toArray();
};

export const getImageById = async (id: string): Promise<ImageRecord | undefined> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const image = await collection.findOne({ id, medium: "image" });
  return image ?? undefined;
};

export const addImage = async (image: ImageRecord): Promise<void> => {
  image.medium = "image";
  const collection = await getCollection<ImageRecord>(collectionName);
  await collection.insertOne(image);
};

export const updateImage = async (image: ImageRecord): Promise<ImageRecord | null> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const result = await collection.findOneAndUpdate(
    { id: image.id },
    { $set: image },
    { returnDocument: "before" }
  );
  return result ?? null;
};

export const deleteImage = async (id: string): Promise<ImageRecord | null> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const result = await collection.findOneAndDelete({ id, medium: "image" });
  return result ?? null;
};

export const getVideos = async (includeReelOnly = false): Promise<ImageRecord[]> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const filter = includeReelOnly
    ? { medium: "video" }
    : { medium: "video", $or: [{ reel_only: { $ne: true } }, { reel_only: { $exists: false } }] };
  return collection.find(filter).toArray();
};

export const getVideoById = async (id: string): Promise<ImageRecord | undefined> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const video = await collection.findOne({ id, medium: "video" });
  return video ?? undefined;
};

export const setShowReel = async (id: string, show: boolean): Promise<void> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  await collection.updateOne({ id }, { $set: { show_reel: show } });
};

export const getReelMedia = async (): Promise<ImageRecord[]> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  return collection.find({ show_reel: true }).toArray();
};

export const addVideo = async (video: ImageRecord): Promise<void> => {
  video.medium = "video";
  const collection = await getCollection<ImageRecord>(collectionName);
  await collection.insertOne(video);
};

export const updateVideo = async (video: ImageRecord): Promise<ImageRecord | null> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const result = await collection.findOneAndUpdate(
    { id: video.id, medium: "video" },
    { $set: video },
    { returnDocument: "before" }
  );
  return result ?? null;
};

export const deleteVideo = async (id: string): Promise<ImageRecord | null> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const result = await collection.findOneAndDelete({ id, medium: "video" });
  return result ?? null;
};

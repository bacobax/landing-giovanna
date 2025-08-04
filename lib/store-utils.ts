import { getCollection } from "./mongodb";

export type ImageRecord = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  medium: string;
  year: string;
};

const collectionName = "images";

export const getImages = async (): Promise<ImageRecord[]> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  return collection.find({ medium: "image" }).toArray();
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
  return result.value ?? null;
};

export const deleteImage = async (id: string): Promise<ImageRecord | null> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const result = await collection.findOneAndDelete({ id, medium: "image" });
  return result.value ?? null;
};

export const getVideos = async (): Promise<ImageRecord[]> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  return collection.find({ medium: "video" }).toArray();
};

export const getVideoById = async (id: string): Promise<ImageRecord | undefined> => {
  const collection = await getCollection<ImageRecord>(collectionName);
  const video = await collection.findOne({ id, medium: "video" });
  return video ?? undefined;
};

import { promises as fs } from "fs";
import path from "path";

const storejsonPath = path.join(process.cwd(), "store", "images.json");

export type ImageRecord = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  medium: string;
  year: string;
};

export const getImages = async (): Promise<ImageRecord[]> => {
    const fileContents = await fs.readFile(storejsonPath, "utf-8");
    return JSON.parse(fileContents);
};

export const getImageById = async (id: string): Promise<ImageRecord | undefined> => {
    const images = await getImages();
    return images.find((image: ImageRecord) => image.id === id);
};

export const addImage = async (image: ImageRecord): Promise<void> => {
    const images = await getImages();
    images.push(image);
    await fs.writeFile(storejsonPath, JSON.stringify(images, null, 2));
};

export const updateImage = async (image: ImageRecord): Promise<ImageRecord | null> => {
    const images = await getImages();
    const index = images.findIndex((img: ImageRecord) => img.id === image.id);
    if (index !== -1) {
        const oldImage = images[index];
        images[index] = image;
        await fs.writeFile(storejsonPath, JSON.stringify(images, null, 2));
        return oldImage;
    } else {
        return null;
    }
};

export const deleteImage = async (id: string): Promise<ImageRecord | null> => {
    const images = await getImages();
    const index = images.findIndex((img: ImageRecord) => img.id === id);
    if (index !== -1) {
        const oldImage = images[index];
        images.splice(index, 1);
        await fs.writeFile(storejsonPath, JSON.stringify(images, null, 2));
        return oldImage;
    } else {
        return null;
    }
};
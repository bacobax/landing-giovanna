import { promises as fs } from "fs";
import path from "path";

const storejsonPath = path.join(process.cwd(), "store", "images.json");

export const getImages = async () => {
    const fileContents = await fs.readFile(storejsonPath, "utf-8");
    return JSON.parse(fileContents);
};

export const getImageById = async (id: string) => {
    const images = await getImages();
    return images.find((image: unknown) => (image as { id: string }).id === id);
};

export const addImage = async (image: unknown) => {
    const images = await getImages();
    images.push(image);
    await fs.writeFile(storejsonPath, JSON.stringify(images, null, 2));
};
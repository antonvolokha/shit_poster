import {ImageServiceInterface} from "../../../Domain/Contract/ImageServiceInterfaсe";
import fetch from "cross-fetch";

const BASE_URL = 'https://pikabu.ru/'

export class PikabuService implements ImageServiceInterface {
    private readonly tags: string[];

    constructor(config: Record<string, any>) {
        this.tags = config.tags;
    }

    public async getImages(): Promise<string[]> {
        const images:string[] = [];

        for (const imagesKey in this.tags) {
           images.push(...await this.getImagesFrom(this.tags[imagesKey]));
        }

        return images;
    }

    public async getImagesFrom(tag: string): Promise<string[]> {
        return (await (await fetch(`${BASE_URL}${tag}?twitmode=1&of=v2&page=1&_=${Date.now() * 1000}`)).json())
            .match(/https?:\/\/cs12.pikabu.ru\/post_img\/.*?"/gm)
            .map((image: string) => {
                return image.substring(0, image.length - 1)
            });
    }
}

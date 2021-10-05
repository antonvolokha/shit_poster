import * as Parser from 'rss-parser';
import {ImageServiceInterface} from "../../../Domain/Contract/ImageServiceInterfaсe";

// eslint-disable-next-line require-jsdoc
export class JoyReactorService implements ImageServiceInterface {
    private readonly rssChannels: string[];

    constructor(config: Record<string, any>) {
        this.rssChannels = config.channels;
    }

    public async getImages(): Promise<string[]> {
        const images: string[] = [];

        // eslint-disable-next-line guard-for-in
        for (const index in this.rssChannels) {
            images.push(...(await this.getImagesFromRss(this.rssChannels[index])));
        }

        return images;
    }

    private async getImagesFromRss(rss: string): Promise<string[]> {
        const parser = new Parser();
        const images: string[] = [];


        (await parser.parseURL(rss)).items.forEach((item) => {
            if (!item.content) {
                console.error('Content not found ;(');
                return;
            }

            const matches = item.content.match(RegExp('src="https?:\/\/.*?"'));
            // eslint-disable-next-line guard-for-in
            for (const index in matches) {
                if (index == '0') {
                    let image = matches[Number.parseInt(index)];
                    if (image.includes('/full/')) {
                        continue;
                    }

                    image = image.replace('src="', '');
                    images.push(image.substring(0, image.length - 1));
                }
            }
        });

        return images;
    }
}

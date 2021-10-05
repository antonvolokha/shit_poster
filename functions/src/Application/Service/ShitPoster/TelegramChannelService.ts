import {ImageServiceInterface} from '../../../Domain/Contract/ImageServiceInterfaсe';
import fetch from 'cross-fetch';

const BASE_TELEGRAM_URL = 'https://t.me/s/';

export class TelegramChannelService implements ImageServiceInterface {
    private channels: string[] = [];

    constructor(configs: Record<string, any>) {
        this.channels = configs.channels;
    }

    public async getImages(): Promise<string[]> {
        const images: string[] = [];

        for (const index in this.channels) {
            images.push(...(await this.getImagesFromTelegram(this.channels[index])));
        }

        console.log(images);
        return images;
    }


    private async getImagesFromTelegram(channel: string): Promise<string[]> {
        const matches = (await (await fetch(`${BASE_TELEGRAM_URL}${channel}`)).text())
            .match(RegExp(/background-image:url\('https?:\/\/.*?.(jpg|jpeg|png)'/gm));

        if (!matches) {
            return [];
        }

        return matches.map((match) => {
            match = match.replace('background-image:url(\'', '');
            return match.substring(0, match.length - 1);
        });
    }
}

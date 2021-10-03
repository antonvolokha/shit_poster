import * as ImagesRepository from '../../../Infrastructure/Persistanse/Firestore/ImagesRepository';
import fetch from 'cross-fetch';

const BASE_URL = 'https://api.telegram.org/bot';
const SEND_MESSAGE_ACTION = 'sendMessage';
const SEND_PHOTO_ACTION = 'sendPhoto';
const IMAGES_EXTENSIONS = [
    '.jpeg',
    '.jpg',
    '.png',
    '.webp',
    '.gif',
];

export class TelegramBotService {
    private token: string;
    private chats: number[];

    constructor(config: Record<string, any>) {
        this.token = config.botToken;
        this.chats = config.chats;
    }

    public async sendMessage(image: string) {
        if (await ImagesRepository.isSended(image)) {
            return;
        }

        let action = SEND_PHOTO_ACTION;
        let params: Record<string, any> = {
            photo: image
        };

        if (!new RegExp(IMAGES_EXTENSIONS.join('|')).test(image)) {
            action = SEND_MESSAGE_ACTION;
            params = {
                text: image
            };
        }

        this.chats.forEach(async (chat) => {
            this.send(action, chat, params);
        });

        ImagesRepository.save(image);
    }

    private send(action: string, chatId: number, params: Record<string, any>): Promise<boolean> {
        const queryParams: string[] = [];
        for (const paramKey in params) {
            queryParams.push(`${paramKey}=${params[paramKey]}`);
        }

        return new Promise(resolve => {
            fetch(`${BASE_URL}${this.token}/${action}?chat_id=${chatId}&${queryParams.join('&')}`)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    resolve(json.ok);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }
}

import * as ImagesRepository from '../Persistanse/Sqlite/ImagesRepository';
import * as TelegramBot from 'node-telegram-bot-api';
import * as requests from 'request-promise-native';

export class TelegramAdapter {
    private token: string;
    private chats: number[];
    private bot: TelegramBot;

    constructor(config: Record<string, any>) {
        this.token = config.botToken;
        this.chats = config.chats;
        this.bot = new TelegramBot(this.token, {polling: false})
    }

    public async sendPhotoOnce(photo: string, save: boolean = true) {
        if (await ImagesRepository.isSended(photo)) {
            return;
        }

        setTimeout(() => {
            this.sendPhoto(photo).then((status) => {
                if (status && save) {
                    ImagesRepository.save(photo);
                }
            });
        }, 500);
    }

    public async sendMessageOnce(message: string, save: boolean = true) {
        if (await ImagesRepository.isSended(message)) {
            return;
        }

        setTimeout(() => {
            this.sendMessage(message).then((status) => {
                if (status && save) {
                    ImagesRepository.save(message);
                }
            })
        }, 500);
    }

    public async sendPhoto(photo: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            const response = await requests({
                uri: photo,
                encoding: null,
            });

            if (!response) {
                resolve(false);
                return;
            }

            for (const chatIdsKey in this.chats) {
                try {
                    await this.bot.sendPhoto(this.chats[chatIdsKey], response);
                } catch (e) {
                    resolve(false);
                    return;
                }
            }

            resolve(true);
        });
    }

    public async sendMessage(message: string): Promise<boolean> {
        let status = true;
        for (const chatIdsKey in this.chats) {
            try {
                if (!(await this.bot.sendMessage(this.chats[chatIdsKey], message)).message_id) {
                    status = false;
                }
            } catch (e) {
                status = false;
            }
        }

        return status;
    }
}

import {BaseSchedule} from './BaseSchedule';
import {JoyReactorService} from '../../Application/Service/ShitPoster/JoyReactorService';
import {TelegramBotService} from '../../Application/Service/ShitPoster/TelegramBotService';
import {coub, rss, telegram} from '../../config';
import {CoubService} from "../../Application/Service/ShitPoster/CoubService";
import {TelegramChannelService} from "../../Application/Service/ShitPoster/TelegramChannelService";

export const scheduleFunction = new BaseSchedule()
    .setSchedule('every 15 minutes')
    .setTimeZone('Europe/Kiev')
    .setAction(async () => {
        const telegramBot = new TelegramBotService(telegram);
        (new JoyReactorService(rss)).getImages().then((images) => {
            images.forEach((image) => {
                telegramBot.sendMessage(image);
            });
        });
        (new CoubService(coub)).getLinks().then((coubs) => {
            coubs.forEach((coub) => {
                telegramBot.sendMessage(coub);
            });
        });
        (new TelegramChannelService(telegram)).getImages().then((images) => {
            console.log(images);
            images.forEach((image) => {
                telegramBot.sendMessage(image);
            });
        });
    }).create();

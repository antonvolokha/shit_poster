import {BaseSchedule} from './BaseSchedule';
import {coub, rss, telegramShit} from '../../config';
//import { telegram} from '../../config';
import {CoubService} from "../../Application/Service/ShitPoster/CoubService";
import {JoyReactorService} from "../../Application/Service/ShitPoster/JoyReactorService";
import {TelegramAdapter} from "../../Infrastructure/Adapter/TelegramAdapter";
import {TelegramChannelService} from "../../Application/Service/ShitPoster/TelegramChannelService";

export const scheduleFunction = new BaseSchedule()
    .setRule('*/1 * * * *')
    .setAction(async () => {
        const telegramBot = new TelegramAdapter(telegramShit);
        (new JoyReactorService(rss)).getImages().then((images) => {
            images.forEach((image) => {
                telegramBot.sendPhotoOnce(image);
            });
        });
        (new CoubService(coub)).getLinks().then((coubs) => {
            coubs.forEach((coub) => {
                telegramBot.sendMessageOnce(coub);
            });
        });
        (new TelegramChannelService(telegramShit)).getImages().then((images) => {
            images.forEach((image) => {
                telegramBot.sendPhotoOnce(image);
            });
        });
    }).create();

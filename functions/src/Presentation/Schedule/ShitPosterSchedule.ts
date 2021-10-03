import {BaseSchedule} from './BaseSchedule';
import {ShitPosterService} from '../../Application/Service/ShitPoster/ShitPosterService';
import {TelegramBotService} from '../../Application/Service/ShitPoster/TelegramBotService';
import {telegram, rss, coub} from '../../config';
import {CoubService} from "../../Application/Service/ShitPoster/CoubService";

export const scheduleFunction = new BaseSchedule()
    .setSchedule('every 15 minutes')
    .setTimeZone('Europe/Kiev')
    .setAction(async () => {
        const telegramBot = new TelegramBotService(telegram);
        (await (new ShitPosterService(rss)).getImages()).forEach((image) => {
            telegramBot.sendMessage(image);
        });
        (await (new CoubService(coub)).getCoubs()).forEach((coub) => {
            telegramBot.sendMessage(coub);
        });
    }).create();

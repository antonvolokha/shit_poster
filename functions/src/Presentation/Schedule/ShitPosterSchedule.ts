import {BaseSchedule} from './BaseSchedule';
import {ShitPosterService} from '../../Application/Service/ShitPoster/ShitPosterService';
import {TelegramBotService} from '../../Application/Service/ShitPoster/TelegramBotService';
import {telegram, rss} from '../../config';

export const scheduleFunction = new BaseSchedule()
    .setSchedule('every 15 minutes')
    .setTimeZone('Europe/Kiev')
    .setAction(async () => {
        const telegramBot = new TelegramBotService(telegram);
        (await (new ShitPosterService(rss)).getImages()).forEach((image) => {
             console.log(image);
            telegramBot.sendImage(image);
        });
    }).create();

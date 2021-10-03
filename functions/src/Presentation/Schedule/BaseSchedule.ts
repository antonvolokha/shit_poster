import * as functions from 'firebase-functions';
import {CloudFunction} from 'firebase-functions';

declare type ScheduleAction = () => void;

// eslint-disable-next-line require-jsdoc
export class BaseSchedule {
  private actions: ScheduleAction[] = [];
  private schedule: string | undefined;
  private timezone: string | undefined;

  setSchedule(schedule: string): BaseSchedule {
    this.schedule = schedule;
    return this;
  }

  setTimeZone(timezone: string): BaseSchedule {
    this.timezone = timezone;
    return this;
  }

  setAction(action: ScheduleAction): BaseSchedule {
    this.actions.push(action);
    return this;
  }

  create(): CloudFunction<unknown> {
    if (!this.schedule) {
      // eslint-disable-next-line no-throw-literal
      throw 'schedule not set';
    }

    if (!this.timezone) {
      // eslint-disable-next-line no-throw-literal
      throw 'timezone not set';
    }

    return functions.pubsub
        .schedule(this.schedule)
        .timeZone(this.timezone)
        .onRun((context) => {
          this.actions.forEach((action: ScheduleAction) => {
            action();
          });
        });
  }
}

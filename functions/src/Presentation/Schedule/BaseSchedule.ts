import {Job, scheduleJob} from 'node-schedule';
import {ScheduleAction} from "../../Domain/Type/ScheduleAction";

export class BaseSchedule {
  private actions: ScheduleAction[] = [];
  private rule: string | undefined;

  setRule(rule: string): BaseSchedule {
    this.rule = rule;
    return this;
  }

  setAction(action: ScheduleAction): BaseSchedule {
    this.actions.push(action);
    return this;
  }

  create(): Job {
    if (!this.rule) {
      throw new Error('Rule is not set');
    }

    return scheduleJob(this.rule, () => {
      this.actions.forEach((action: ScheduleAction) => {
        action();
      });
    });
  }
}

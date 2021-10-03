import fetch from 'cross-fetch';

const BASE_COUB_TAG_URL = 'https://coub.com/api/v2/timeline/tag/';
const BASE_VIEW_URL = 'https://coub.com/view/';

export class CoubService {
    private tags: string[] = [];

    constructor(configs: Record<string, any>) {
        this.tags = configs.tags;
    }

    public async getCoubs(): Promise<string[]> {
        const coubs: string[] = [];

        for (const tagsKey in this.tags) {
            coubs.push(...(await this.getCoubsByTag(this.tags[tagsKey])));
        }

        return coubs;
    }

    private async getCoubsByTag(tag: string): Promise<string[]> {
        const coubs: string[] = [];

        (await (await fetch(`${BASE_COUB_TAG_URL}${tag}?order_by=newest&page=1`)).json()).coubs.forEach((coub: any) => {
            if (coub.permalink) {
                coubs.push(`${BASE_VIEW_URL}${coub.permalink}`);
            }
        });

        return coubs;
    }
}

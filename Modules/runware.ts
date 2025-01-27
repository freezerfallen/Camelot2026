import { IOutputFormat, Runware } from "@runware/sdk-js";
import config from '../config.json';

const runware = new Runware({ apiKey: config.runware.apiKey });

type RunwareModel = "FLUX.1 (Schnell)" | "FLUX.1 (Dev)" | "Anything V3";

const runwareModel: Record<RunwareModel, string> = {
    "FLUX.1 (Schnell)": "runware:100@1",
    "FLUX.1 (Dev)": "runware:101@1",
    "Anything V3": "civitai:66@75",
};

export const generateImages = async ({ prompt, negativePrompt, outputFormat = "JPG", model = "FLUX.1 (Dev)", number = 1, width = 512, height = 512, steps = 20, CFGScale = undefined }: {
    prompt: string,
    negativePrompt?: string,
    /**
     * JPG, PNG, WebP
     * @default "JPG"
     */
    outputFormat?: IOutputFormat;
    /**
     * @default "FLUX.1 (Dev)"
     */
    model?: RunwareModel;
    /**
     * Number of images to generate
     * @default 1
     */
    number?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * @default 512
     */
    width?: 512 | 576 | 768 | 1024 | 1280 | 1536 | 1792 | 2048;
    /**
     * @default 512
     */
    height?: 512 | 768 | 896 | 1024 | 1280 | 1536 | 1792 | 2048;
    /**
     * @default 20
     */
    steps?: 10 | 20 | 30 | 40 | 50;
    /**
     * @default undefined
     */
    CFGScale?: number;
}) => {
    try {
        const images = await runware.requestImages({
            positivePrompt: prompt,
            model: runwareModel[model],
            numberResults: number,
            negativePrompt,
            height,
            width,
            steps,
            outputFormat,
            CFGScale,
        });

        return images ?? [];
    } catch {
        return [];
    };
};

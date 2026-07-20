import { OpenRouter } from '@openrouter/sdk';

const MODEL_CHAIN: string[] = [
    'openrouter/owl-alpha',
    'google/gemini-3.1-flash-lite',
    'deepseek/deepseek-v4-flash',
    '~google/gemini-flash-latest',
];

interface GenerateTextOptions {
    chatHistory: string[];
    systemInstruction?: string;
    maxOutputTokens?: number;
}

export const generateText = async ({
    chatHistory,
    systemInstruction,
    maxOutputTokens = 512,
}: GenerateTextOptions): Promise<string | undefined> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.error('[OpenRouter] OPENROUTER_API_KEY is not set');
        return undefined;
    }

    const client = new OpenRouter({
        apiKey,
        httpReferer: 'https://discord.gg/camelot',
        appTitle: 'Camelot Bot',
    });

    const messages: { role: 'system' | 'user' | 'assistant'; content: string; }[] = [];

    if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
    }

    const historyText = chatHistory.map(m => m || '<empty string>').join('\n');
    messages.push({ role: 'user', content: historyText });

    const errors: { model: string; error: string; }[] = [];

    for (const model of MODEL_CHAIN) {
        try {
            const result = await client.chat.send({
                chatRequest: {
                    model,
                    messages,
                    maxTokens: maxOutputTokens,
                    stream: false,
                },
            });

            const text = result.choices[0]?.message?.content;
            if (text) return text;

            errors.push({ model, error: 'empty response' });
            console.warn(`[OpenRouter] Model ${model} returned empty response, trying next...`);
        } catch (err: any) {
            const status = err?.status ?? err?.statusCode;
            const message = err?.message ?? String(err);
            errors.push({ model, error: `[${status ?? '?'}] ${message}` });
            console.warn(`[OpenRouter] Model ${model} failed: [${status ?? '?'}] ${message}`);
        }
    }

    console.error('[OpenRouter] All models failed:', errors);
    return undefined;
};

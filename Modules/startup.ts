import fs from 'fs';
import path from 'path';

const requiredEnvironmentVariables = [
    'CLIENT_ID',
    'TOKEN',
    'PG_USER',
    'PG_DATABASE',
    'PG_PASSWORD',
    'ADMINS',
] as const;

const rollingDefaults = {
    start: Date.now() - (14 * 24 * 60 * 60 * 1000),
    days: 5,
    rollsPerDay: 3,
    fightsPerCharacter: 3,
    timeInMinutes: 30,
    level: 600,
    clvl: 1200,
    goldenCowChance: 0.02,
};

const storageDefaults: Record<string, unknown> = {
    'blacklist.json': {},
    'moderators.json': {},
    'premiumGift.json': {},
    'premiumGifted.json': {},
    'rolling.json': rollingDefaults,
};

function isMissing(value: string | undefined): boolean {
    return value === undefined || value.trim().length === 0;
}

function validatePort(name: 'PG_PORT' | 'STAMPS_PORT'): void {
    const value = process.env[name];
    if (isMissing(value)) return;

    const port = Number(value);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error(`Invalid environment configuration:\n- ${name} must be an integer between 1 and 65535.`);
    }
}

export function validateEnvironment(): void {
    const missing = requiredEnvironmentVariables.filter((name) => isMissing(process.env[name]));
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missing.map((name) => `- ${name}`).join('\n')}\n` +
            'Copy .env.example to .env and provide values before starting Camelot.'
        );
    }

    if (!/^\d{17,20}$/.test(process.env.CLIENT_ID)) {
        throw new Error('Invalid environment configuration:\n- CLIENT_ID must be a Discord application ID.');
    }

    const adminIds = process.env.ADMINS.split(',').map((id) => id.trim()).filter(Boolean);
    if (adminIds.length === 0 || adminIds.some((id) => !/^\d{17,20}$/.test(id))) {
        throw new Error('Invalid environment configuration:\n- ADMINS must be a comma-separated list of Discord user IDs.');
    }

    validatePort('PG_PORT');
    validatePort('STAMPS_PORT');
}

export function ensureRuntimeStorage(baseDirectory: string = process.cwd()): void {
    const storageDirectory = path.join(baseDirectory, 'Storage');
    fs.mkdirSync(storageDirectory, { recursive: true });

    for (const [filename, defaultValue] of Object.entries(storageDefaults)) {
        const filePath = path.join(storageDirectory, filename);
        try {
            fs.writeFileSync(filePath, `${JSON.stringify(defaultValue, null, 2)}\n`, {
                encoding: 'utf8',
                flag: 'wx',
            });
        } catch (error) {
            const code = (error as NodeJS.ErrnoException).code;
            if (code !== 'EEXIST') throw error;
        }

        try {
            const contents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (contents === null || typeof contents !== 'object' || Array.isArray(contents)) {
                throw new Error('the top-level value must be a JSON object');
            }
        } catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            throw new Error(`Invalid runtime storage file ${path.relative(baseDirectory, filePath)}: ${reason}`);
        }
    }
}

export function bootstrapApplication(): void {
    ensureRuntimeStorage();
    validateEnvironment();
}

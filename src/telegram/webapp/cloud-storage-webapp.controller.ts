import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { validateInitData } from '@telegram/webapp/webapp-auth.utils';

@Controller('webapp')
export class CloudStorageWebAppController {
  constructor(private readonly telegramConfig: TelegramConfig) {}

  @Get('cloud-storage')
  getCloudStoragePage(@Res() res: any) {
    const candidates = [
      join(__dirname, 'cloud-storage.html'),
      join(process.cwd(), 'src/telegram/webapp/cloud-storage.html'),
    ];
    const filePath = candidates.find((path) => existsSync(path));
    if (!filePath) {
      return res.status(404).send('Cloud storage webapp file not found.');
    }
    const html = readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }

  @Post('webapp-auth')
  authenticateWebApp(@Body() body: { initData?: string; payload?: unknown }) {
    const initData = body?.initData;
    if (!initData) {
      return { ok: false, error: 'initData is required.' };
    }
    try {
      const parsed = validateInitData(initData, this.telegramConfig.bot.token);
      return { ok: true, user: parsed.user ?? null, payload: body?.payload ?? null };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}

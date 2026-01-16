import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

@Controller('webapp')
export class CloudStorageWebAppController {
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
}

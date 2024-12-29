// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { AppConfig } from './configurationSchema';
//
// @Injectable()
// export class TypedConfigService {
//     constructor(private readonly configService: ConfigService<AppConfig>) {}
//
//     get configuration(): AppConfig {
//         return {
//             application: this.configService.get<AppConfig['application']>('application', { infer: true })!,
//             telegram: this.configService.get<AppConfig['telegram']>('telegram', { infer: true })!,
//         };
//     }
// }
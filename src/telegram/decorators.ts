import { Context as TelegrafContext } from 'telegraf';
import { SetMetadata, UseGuards, Injectable, CanActivate, ExecutionContext } from '@nestjs/common';


export function CatchErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Error in ${propertyKey}: ${error.message}`, error.stack);
            } else {
                console.error(`Error in ${propertyKey}:`, error);
            }
        }
    };

    return descriptor;
}


// Define admin Telegram IDs here (Replace with actual IDs)
const ADMIN_IDS = [123456789, 987654321];

export const AdminOnly = () => SetMetadata('adminOnly', true);

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToRpc().getContext<TelegrafContext>();
        const userId = ctx.from?.id;

        if (!userId) return false; // Prevent execution if no user ID is found
        return ADMIN_IDS.includes(userId);
    }
}


// Custom decorator to pass allowed IDs dynamically
export const AllowOnly = (ids: number[]) => SetMetadata('allowedIds', ids);

@Injectable()
export class IdGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToRpc().getContext<TelegrafContext>();
        const userId = ctx.from?.id;
        const allowedIds = this.getAllowedIds(context);

        return userId ? allowedIds.includes(userId) : false;
    }

    private getAllowedIds(context: ExecutionContext): number[] {
        return context.getHandler().constructor['allowedIds'] || [];
    }
}
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
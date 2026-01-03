/**
 * Logger estructurado para HabitatPro Frontend
 * Reemplaza console.log/error/warn con logging estructurado
 */

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'info';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  url?: string;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private enabled = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_LOGS === 'true';

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    
    // En producción, solo log errores
    if (this.isProduction) {
      return level === 'error';
    }
    
    // En desarrollo, log todo
    return true;
  }

  log(message: string, ...args: any[]): void {
    if (this.shouldLog('log')) {
      const entry = this.formatMessage('log', message, args);
      console.log(`[LOG] ${entry.timestamp} - ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      const entry = this.formatMessage('info', message, args);
      console.info(`[INFO] ${entry.timestamp} - ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      const entry = this.formatMessage('warn', message, args);
      console.warn(`[WARN] ${entry.timestamp} - ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | any, ...args: any[]): void {
    // Errores siempre se logean, pero sanitizados en producción
    const entry = this.formatMessage('error', message, error);
    
    if (this.isProduction) {
      // En producción, sanitizar información sensible
      console.error(`[ERROR] ${entry.timestamp} - ${message}`);
      
      // Enviar a servicio de monitoreo (Sentry, etc.)
      if (error && typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error);
      }
    } else {
      // En desarrollo, mostrar error completo
      console.error(`[ERROR] ${entry.timestamp} - ${message}`, error, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug') && !this.isProduction) {
      const entry = this.formatMessage('debug', message, args);
      console.debug(`[DEBUG] ${entry.timestamp} - ${message}`, ...args);
    }
  }
}

// Exportar singleton
export const logger = new Logger();

// Exportar por compatibilidad
export default logger;


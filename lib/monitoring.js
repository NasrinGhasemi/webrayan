/**
 * Monitoring and Logging System
 * سیستم نظارت و گزارش‌گیری برای پایش عملکرد و امنیت
 */

import { getClientIp } from '@/lib/http/client-ip';
import { headers } from 'next/headers';

// Log Levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

// Event Types
export const EVENT_TYPES = {
  AUTH: 'auth',
  API: 'api',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  USER: 'user',
  SYSTEM: 'system',
};

/**
 * Logger Class
 */
export class Logger {
  constructor(service = 'webrayan') {
    this.service = service;
    this.environment = process.env.NODE_ENV || 'development';
  }

  formatLog(level, message, data = {}, eventType = EVENT_TYPES.SYSTEM) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.service,
      environment: this.environment,
      eventType,
      message,
      ...data,
    };

    // Add request context if available
    try {
      const headersList = headers();
      logEntry.requestId =
        headersList.get('x-request-id') || this.generateRequestId();
      logEntry.userAgent = headersList.get('user-agent');
      logEntry.ip =
        getClientIp(headersList);
    } catch (error) {
      // Headers not available in this context
    }

    return logEntry;
  }

  generateRequestId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  error(message, data = {}, eventType = EVENT_TYPES.SYSTEM) {
    const logEntry = this.formatLog(LOG_LEVELS.ERROR, message, data, eventType);
    console.error(JSON.stringify(logEntry));

    // Send to external monitoring service in production
    if (this.environment === 'production') {
      this.sendToMonitoring(logEntry);
    }
  }

  warn(message, data = {}, eventType = EVENT_TYPES.SYSTEM) {
    const logEntry = this.formatLog(LOG_LEVELS.WARN, message, data, eventType);
    console.warn(JSON.stringify(logEntry));
  }

  info(message, data = {}, eventType = EVENT_TYPES.SYSTEM) {
    const logEntry = this.formatLog(LOG_LEVELS.INFO, message, data, eventType);
    console.info(JSON.stringify(logEntry));
  }

  debug(message, data = {}, eventType = EVENT_TYPES.SYSTEM) {
    if (this.environment === 'development') {
      const logEntry = this.formatLog(
        LOG_LEVELS.DEBUG,
        message,
        data,
        eventType
      );
      console.debug(JSON.stringify(logEntry));
    }
  }

  async sendToMonitoring(logEntry) {
    try {
      // Example: Send to external service (Sentry, LogRocket, etc.)
      if (process.env.MONITORING_WEBHOOK_URL) {
        await fetch(process.env.MONITORING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logEntry),
        });
      }
    } catch (error) {
      console.error('Failed to send log to monitoring service:', error);
    }
  }
}

// Global logger instance
export const logger = new Logger();

/**
 * Security Event Logger
 */
export class SecurityLogger extends Logger {
  logFailedAuth(email, reason, ip) {
    this.warn(
      'Authentication failed',
      {
        email,
        reason,
        ip,
        timestamp: Date.now(),
      },
      EVENT_TYPES.SECURITY
    );
  }

  logSuccessfulAuth(userId, method, ip) {
    this.info(
      'Authentication successful',
      {
        userId,
        method,
        ip,
        timestamp: Date.now(),
      },
      EVENT_TYPES.AUTH
    );
  }

  logSuspiciousActivity(activity, details) {
    this.error(
      'Suspicious activity detected',
      {
        activity,
        ...details,
        timestamp: Date.now(),
      },
      EVENT_TYPES.SECURITY
    );
  }

  logRateLimitExceeded(identifier, endpoint, ip) {
    this.warn(
      'Rate limit exceeded',
      {
        identifier,
        endpoint,
        ip,
        timestamp: Date.now(),
      },
      EVENT_TYPES.SECURITY
    );
  }

  logCSRFViolation(ip, userAgent) {
    this.error(
      'CSRF token violation',
      {
        ip,
        userAgent,
        timestamp: Date.now(),
      },
      EVENT_TYPES.SECURITY
    );
  }
}

/**
 * Performance Monitor
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null,
    });
  }

  endTimer(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;

      logger.info(
        'Performance metric',
        {
          name,
          duration: metric.duration,
          unit: 'ms',
        },
        EVENT_TYPES.PERFORMANCE
      );

      return metric.duration;
    }
    return null;
  }

  measureAsync(name, asyncFunction) {
    return async (...args) => {
      this.startTimer(name);
      try {
        const result = await asyncFunction(...args);
        this.endTimer(name);
        return result;
      } catch (error) {
        this.endTimer(name);
        logger.error(
          `Error in ${name}`,
          { error: error.message },
          EVENT_TYPES.PERFORMANCE
        );
        throw error;
      }
    };
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

/**
 * API Request Monitor
 */
export function createAPIMonitor() {
  return async (request, response, next) => {
    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers.get('user-agent');
    const ip =
      getClientIp(request.headers);

    try {
      // Execute the API handler
      const result = await next();

      const duration = Date.now() - startTime;
      const status = response?.status || 200;

      // Log API request
      logger.info(
        'API request completed',
        {
          method,
          url,
          status,
          duration,
          ip,
          userAgent,
        },
        EVENT_TYPES.API
      );

      // Log slow requests
      if (duration > 2000) {
        logger.warn(
          'Slow API request',
          {
            method,
            url,
            duration,
            threshold: 2000,
          },
          EVENT_TYPES.PERFORMANCE
        );
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error(
        'API request failed',
        {
          method,
          url,
          error: error.message,
          stack: error.stack,
          duration,
          ip,
          userAgent,
        },
        EVENT_TYPES.API
      );

      throw error;
    }
  };
}

/**
 * Error Tracking
 */
export class ErrorTracker {
  constructor() {
    this.errorCounts = new Map();
    this.errorThreshold = 10; // Alert after 10 similar errors
    this.timeWindow = 60 * 1000; // 1 minute window
  }

  trackError(error, context = {}) {
    const errorKey = `${error.name}:${error.message}`;
    const now = Date.now();

    if (!this.errorCounts.has(errorKey)) {
      this.errorCounts.set(errorKey, []);
    }

    const errors = this.errorCounts.get(errorKey);
    errors.push({ timestamp: now, context });

    // Clean old errors outside time window
    const recentErrors = errors.filter(
      e => now - e.timestamp < this.timeWindow
    );
    this.errorCounts.set(errorKey, recentErrors);

    // Check if threshold exceeded
    if (recentErrors.length >= this.errorThreshold) {
      this.alertHighErrorRate(errorKey, recentErrors);
    }

    // Log the error
    logger.error(
      'Application error',
      {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        context,
        errorCount: recentErrors.length,
      },
      EVENT_TYPES.SYSTEM
    );
  }

  alertHighErrorRate(errorKey, errors) {
    logger.error(
      'High error rate detected',
      {
        errorKey,
        count: errors.length,
        timeWindow: this.timeWindow,
        threshold: this.errorThreshold,
      },
      EVENT_TYPES.SYSTEM
    );
  }
}

/**
 * Health Check Monitor
 */
export class HealthMonitor {
  constructor() {
    this.checks = new Map();
  }

  addCheck(name, checkFunction, interval = 60000) {
    this.checks.set(name, {
      name,
      checkFunction,
      interval,
      lastCheck: null,
      status: 'unknown',
      error: null,
    });
  }

  async runCheck(name) {
    const check = this.checks.get(name);
    if (!check) return null;

    try {
      const startTime = Date.now();
      await check.checkFunction();
      const duration = Date.now() - startTime;

      check.lastCheck = new Date();
      check.status = 'healthy';
      check.error = null;
      check.duration = duration;

      logger.info(
        'Health check passed',
        {
          name,
          duration,
          status: 'healthy',
        },
        EVENT_TYPES.SYSTEM
      );

      return { name, status: 'healthy', duration };
    } catch (error) {
      check.lastCheck = new Date();
      check.status = 'unhealthy';
      check.error = error.message;

      logger.error(
        'Health check failed',
        {
          name,
          error: error.message,
          status: 'unhealthy',
        },
        EVENT_TYPES.SYSTEM
      );

      return { name, status: 'unhealthy', error: error.message };
    }
  }

  async runAllChecks() {
    const results = {};
    for (const [name] of this.checks) {
      results[name] = await this.runCheck(name);
    }
    return results;
  }

  getStatus() {
    const status = {};
    for (const [name, check] of this.checks) {
      status[name] = {
        name: check.name,
        status: check.status,
        lastCheck: check.lastCheck,
        error: check.error,
        duration: check.duration,
      };
    }
    return status;
  }
}

/**
 * User Activity Tracker
 */
export class UserActivityTracker {
  trackUserAction(userId, action, details = {}) {
    logger.info(
      'User action',
      {
        userId,
        action,
        details,
        timestamp: Date.now(),
      },
      EVENT_TYPES.USER
    );
  }

  trackPageView(userId, page, referrer) {
    logger.info(
      'Page view',
      {
        userId,
        page,
        referrer,
        timestamp: Date.now(),
      },
      EVENT_TYPES.USER
    );
  }

  trackFormSubmission(userId, formType, success) {
    logger.info(
      'Form submission',
      {
        userId,
        formType,
        success,
        timestamp: Date.now(),
      },
      EVENT_TYPES.USER
    );
  }
}

// Global instances
export const securityLogger = new SecurityLogger();
export const performanceMonitor = new PerformanceMonitor();
export const errorTracker = new ErrorTracker();
export const healthMonitor = new HealthMonitor();
export const userActivityTracker = new UserActivityTracker();

/**
 * Monitoring Middleware Factory
 */
export function createMonitoringMiddleware(options = {}) {
  const {
    logRequests = true,
    trackPerformance = true,
    trackErrors = true,
  } = options;

  return async (request, context, next) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(2);

    // Add request ID to headers
    request.headers.set('x-request-id', requestId);

    try {
      if (logRequests) {
        logger.info(
          'Request started',
          {
            requestId,
            method: request.method,
            url: request.url,
            userAgent: request.headers.get('user-agent'),
            ip: getClientIp(request.headers),
          },
          EVENT_TYPES.API
        );
      }

      const result = await next();

      if (trackPerformance) {
        const duration = Date.now() - startTime;
        logger.info(
          'Request completed',
          {
            requestId,
            duration,
            status: context.response?.status || 200,
          },
          EVENT_TYPES.PERFORMANCE
        );
      }

      return result;
    } catch (error) {
      if (trackErrors) {
        errorTracker.trackError(error, {
          requestId,
          method: request.method,
          url: request.url,
        });
      }
      throw error;
    }
  };
}

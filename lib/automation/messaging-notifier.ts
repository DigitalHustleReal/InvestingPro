/**
 * Messaging Notifier
 * Sends notifications via WhatsApp and Telegram
 * 
 * FREE TIER:
 * - Telegram Bot API: Completely free, unlimited messages
 * - WhatsApp Business API: Free tier available (1000 conversations/month)
 * - WhatsApp Cloud API: Free for Meta verified businesses (1000 messages/day)
 */

import { logger } from '@/lib/logger';

export interface MessagingNotification {
    message: string;
    recipients: {
        telegram?: string[]; // Chat IDs or channel usernames
        whatsapp?: string[]; // Phone numbers with country code
    };
}

export interface MessagingResult {
    telegram: {
        sent: boolean;
        successCount: number;
        failedCount: number;
        errors?: string[];
    };
    whatsapp: {
        sent: boolean;
        successCount: number;
        failedCount: number;
        errors?: string[];
    };
}

/**
 * Send notification via Telegram Bot
 * 
 * Setup:
 * 1. Create bot via @BotFather on Telegram
 * 2. Get bot token
 * 3. Add TELEGRAM_BOT_TOKEN to environment variables
 * 4. Get chat IDs:
 *    - For groups: Add bot to group, send /start, check bot logs
 *    - For channels: Add bot as admin, use @channelusername format
 */
export async function sendTelegramMessage(
    chatId: string | string[],
    message: string
): Promise<{ success: boolean; sentCount: number; failedCount: number; errors?: string[] }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
        logger.warn('Telegram bot token not configured, skipping Telegram notification');
        return {
            success: false,
            sentCount: 0,
            failedCount: Array.isArray(chatId) ? chatId.length : 1,
            errors: ['TELEGRAM_BOT_TOKEN not configured']
        };
    }

    const chatIds = Array.isArray(chatId) ? chatId : [chatId];
    const errors: string[] = [];
    let successCount = 0;

    for (const id of chatIds) {
        try {
            // Telegram Bot API endpoint
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: id,
                    text: message,
                    parse_mode: 'HTML', // Support HTML formatting
                    disable_web_page_preview: false
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ description: 'Unknown error' }));
                throw new Error(error.description || `HTTP ${response.status}`);
            }

            successCount++;
            logger.info('Telegram message sent successfully', { chatId: id });

        } catch (error: any) {
            errors.push(`Failed to send to ${id}: ${error.message}`);
            logger.error('Failed to send Telegram message', error, { chatId: id });
        }
    }

    return {
        success: successCount > 0,
        sentCount: successCount,
        failedCount: chatIds.length - successCount,
        errors: errors.length > 0 ? errors : undefined
    };
}

/**
 * Send notification via WhatsApp
 * 
 * Option 1: WhatsApp Cloud API (Free - Meta Verified Businesses)
 * - 1000 messages/day free
 * - Requires Meta Business Account
 * - Setup: https://developers.facebook.com/docs/whatsapp/cloud-api
 * 
 * Option 2: WhatsApp Business API (via Twilio - Free Tier)
 * - 1000 conversations/month free
 * - Setup: https://www.twilio.com/whatsapp
 * 
 * Option 3: WhatsApp Web API (Unofficial - Free)
 * - Use libraries like whatsapp-web.js
 * - Requires WhatsApp Web session
 * - Not recommended for production (ToS violation risk)
 */
export async function sendWhatsAppMessage(
    phoneNumbers: string[],
    message: string
): Promise<{ success: boolean; sentCount: number; failedCount: number; errors?: string[] }> {
    // Try WhatsApp Cloud API first (Meta)
    if (process.env.WHATSAPP_CLOUD_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
        return await sendViaWhatsAppCloudAPI(phoneNumbers, message);
    }

    // Try Twilio WhatsApp API
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        return await sendViaTwilioWhatsApp(phoneNumbers, message);
    }

    logger.warn('WhatsApp API not configured, skipping WhatsApp notification');
    return {
        success: false,
        sentCount: 0,
        failedCount: phoneNumbers.length,
        errors: ['WhatsApp API credentials not configured (WHATSAPP_CLOUD_API_TOKEN or TWILIO_ACCOUNT_SID)']
    };
}

/**
 * Send via WhatsApp Cloud API (Meta)
 */
async function sendViaWhatsAppCloudAPI(
    phoneNumbers: string[],
    message: string
): Promise<{ success: boolean; sentCount: number; failedCount: number; errors?: string[] }> {
    const apiToken = process.env.WHATSAPP_CLOUD_API_TOKEN!;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    const version = process.env.WHATSAPP_API_VERSION || 'v21.0';

    const errors: string[] = [];
    let successCount = 0;

    for (const phoneNumber of phoneNumbers) {
        try {
            // Format phone number (remove +, ensure proper format)
            const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');

            const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: formattedPhone,
                    type: 'text',
                    text: {
                        body: message
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
                throw new Error(error.error?.message || `HTTP ${response.status}`);
            }

            successCount++;
            logger.info('WhatsApp message sent successfully (Cloud API)', { phoneNumber });

        } catch (error: any) {
            errors.push(`Failed to send to ${phoneNumber}: ${error.message}`);
            logger.error('Failed to send WhatsApp message (Cloud API)', error, { phoneNumber });
        }
    }

    return {
        success: successCount > 0,
        sentCount: successCount,
        failedCount: phoneNumbers.length - successCount,
        errors: errors.length > 0 ? errors : undefined
    };
}

/**
 * Send via Twilio WhatsApp API
 */
async function sendViaTwilioWhatsApp(
    phoneNumbers: string[],
    message: string
): Promise<{ success: boolean; sentCount: number; failedCount: number; errors?: string[] }> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio sandbox

    const errors: string[] = [];
    let successCount = 0;

    for (const phoneNumber of phoneNumbers) {
        try {
            // Format phone number (ensure whatsapp: prefix)
            const formattedPhone = phoneNumber.startsWith('whatsapp:') 
                ? phoneNumber 
                : `whatsapp:${phoneNumber.replace(/[^0-9+]/g, '')}`;

            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

            const formData = new URLSearchParams();
            formData.append('From', fromNumber);
            formData.append('To', formattedPhone);
            formData.append('Body', message);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            successCount++;
            logger.info('WhatsApp message sent successfully (Twilio)', { phoneNumber });

        } catch (error: any) {
            errors.push(`Failed to send to ${phoneNumber}: ${error.message}`);
            logger.error('Failed to send WhatsApp message (Twilio)', error, { phoneNumber });
        }
    }

    return {
        success: successCount > 0,
        sentCount: successCount,
        failedCount: phoneNumbers.length - successCount,
        errors: errors.length > 0 ? errors : undefined
    };
}

/**
 * Send notification to both Telegram and WhatsApp
 */
export async function sendMessagingNotification(
    notification: MessagingNotification
): Promise<MessagingResult> {
    const result: MessagingResult = {
        telegram: {
            sent: false,
            successCount: 0,
            failedCount: 0
        },
        whatsapp: {
            sent: false,
            successCount: 0,
            failedCount: 0
        }
    };

    // Send to Telegram
    if (notification.recipients.telegram && notification.recipients.telegram.length > 0) {
        const telegramResult = await sendTelegramMessage(
            notification.recipients.telegram,
            notification.message
        );
        result.telegram = {
            sent: telegramResult.success,
            successCount: telegramResult.sentCount,
            failedCount: telegramResult.failedCount,
            errors: telegramResult.errors
        };
    }

    // Send to WhatsApp
    if (notification.recipients.whatsapp && notification.recipients.whatsapp.length > 0) {
        const whatsappResult = await sendWhatsAppMessage(
            notification.recipients.whatsapp,
            notification.message
        );
        result.whatsapp = {
            sent: whatsappResult.success,
            successCount: whatsappResult.sentCount,
            failedCount: whatsappResult.failedCount,
            errors: whatsappResult.errors
        };
    }

    return result;
}

/**
 * Utility class.
 */

import '#@initialize.ts';

import * as nodeMailer from 'nodemailer';

/**
 * Exports nodeMailer utilities.
 */
export { nodeMailer as $ };
export const { createTransport } = nodeMailer;

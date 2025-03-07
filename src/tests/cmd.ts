/**
 * Test suite.
 */

import { $cmd } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$cmd', async () => {
    test('.esc()', async () => {
        expect($cmd.esc('--arg')).toBe('--arg');
        expect($cmd.esc('a b c')).toBe('a\\ b\\ c');
    });
    test('.quote()', async () => {
        expect($cmd.quote('--arg')).toBe("'--arg'");
        expect($cmd.quote('a b c')).toBe("'a b c'");
    });
});

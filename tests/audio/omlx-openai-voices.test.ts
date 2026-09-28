/**
 * [fork-local] Lock the OMLX CustomVoice speaker entries appended to the
 * built-in openai-tts catalog (commit 4db5edcf).
 *
 * This fork syncs upstream with `-X theirs`, so an upstream edit to the same
 * voices-array region would silently drop the OMLX block during a merge and
 * narration would start failing with provider 400s for no obvious reason.
 * This test makes that loss loud: if it fails after a sync, re-append the
 * block (see the "Fork-local" comment in TTS_PROVIDERS['openai-tts'].voices).
 *
 * The speaker ids are the served checkpoint's talker_config.spk_id keys —
 * lowercase, underscore-separated. Do not "fix" their casing.
 */
import { describe, expect, it } from 'vitest';

import { DEFAULT_TTS_VOICES, TTS_PROVIDERS } from '@/lib/audio/constants';

const OMLX_SPEAKER_IDS = [
  'serena',
  'vivian',
  'uncle_fu',
  'ryan',
  'aiden',
  'ono_anna',
  'sohee',
  'eric',
  'dylan',
] as const;

describe('OMLX CustomVoice speakers in the openai-tts catalog [fork-local]', () => {
  it('keeps all OMLX speakers listed under openai-tts', () => {
    const voiceIds = TTS_PROVIDERS['openai-tts'].voices.map((voice) => voice.id);
    for (const speaker of OMLX_SPEAKER_IDS) {
      expect(
        voiceIds,
        `missing OMLX speaker "${speaker}" — re-append the fork-local voices block`,
      ).toContain(speaker);
    }
  });

  it('keeps serena as the openai-tts default voice', () => {
    expect(DEFAULT_TTS_VOICES['openai-tts']).toBe('serena');
  });

  it('labels OMLX voices with the OMLX name prefix so they are identifiable in pickers', () => {
    for (const voice of TTS_PROVIDERS['openai-tts'].voices) {
      if (OMLX_SPEAKER_IDS.includes(voice.id as (typeof OMLX_SPEAKER_IDS)[number])) {
        expect(voice.name.startsWith('OMLX ')).toBe(true);
      }
    }
  });
});

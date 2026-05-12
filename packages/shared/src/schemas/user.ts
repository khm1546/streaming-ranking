import { z } from 'zod';

export const nicknameSchema = z
  .string()
  .min(2, '닉네임은 2자 이상이어야 합니다.')
  .max(20, '닉네임은 20자 이하여야 합니다.')
  .regex(/^[가-힣a-zA-Z0-9_]+$/, '한글, 영문, 숫자, 언더바만 사용 가능합니다.');

export const setNicknameSchema = z.object({
  nickname: nicknameSchema,
});

export type SetNicknameInput = z.infer<typeof setNicknameSchema>;

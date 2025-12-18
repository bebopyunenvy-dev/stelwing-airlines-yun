import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const CreateBookingSchema = z
  .object({
    firstName: z.string().trim().min(1).regex(/^[A-Z]+$/),
    lastName: z.string().trim().min(1).regex(/^[A-Z]+$/),
    gender: z.enum(['M', 'F']).optional().nullable(),
    nationality: z.string().length(2),
    passportNo: z.string().trim().min(1),
    passportExpiry: z.string().regex(dateRegex),

    cabinClass: z.string(),
    currency: z.string(),
    totalAmount: z.number().int().nonnegative(),

    outbound: z.object({
      flightId: z.number().int(),
      seats: z.array(
        z.object({
          seatId: z.number().int(),
        })
      ),
      baggageId: z.number().int().nullable().optional(),
      mealId: z.number().int().nullable().optional(),
    }),

    inbound: z
      .object({
        flightId: z.number().int(),
        seats: z.array(
          z.object({
            seatId: z.number().int(),
          })
        ),
        baggageId: z.number().int().nullable().optional(),
        mealId: z.number().int().nullable().optional(),
      })
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const passport = data.passportNo.trim();

    if (data.nationality === 'TW') {
      if (!/^[A-Z][0-9]{8}$/.test(passport)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['passportNo'],
          message: '台灣護照格式為 1 碼英文 + 8 碼數字',
        });
      }
    } else {
      if (!/^[A-Z0-9]{6,9}$/.test(passport)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['passportNo'],
          message: '護照需為 6–9 碼英文大寫與數字',
        });
      }
    }
  });

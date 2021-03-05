import joi from 'joi';

export const createAccountSchema = joi.object({
  personName: joi.string().required(),
  personDocument: joi.string().length(11).required(),
  personBirthdate: joi.string().required(),
  dailyWithdrawalLimit: joi.number().min(0),
  accountType: joi.number(),
});

export const depositSchema = joi.object({
  params: joi.object({
    id: joi.number().required(),
  }).required(),
  body: joi.object({
    amount: joi.number().required(),
  }).required(),
});

export const withdrawalSchema = joi.object({
  params: joi.object({
    id: joi.number().required(),
  }).required(),
  body: joi.object({
    amount: joi.number().required(),
  }).required(),
});

export const balanceSchema = joi.object({
  params: joi.object({
    id: joi.number().required(),
  }).required(),
});

export const extractSchema = joi.object({
  params: joi.object({
    id: joi.number().required(),
  }).required(),
  query: joi.object({
    initialDate: joi.date(),
    finalDate: joi.date().min(joi.ref('initialDate')),
  }).with('initialDate', 'finalDate'),
});

export const blockSchema = joi.object({
  params: joi.object({
    id: joi.number().required(),
  }).required(),
});

import { Router, Request, Response, NextFunction } from 'express';
import { Container } from '../../../container';
import { AccountService } from '../../../container/services/account';
import { CreateAccountRequestData } from '../../../types/Account';
import {
  createAccountSchema,
  depositSchema,
  balanceSchema,
  withdrawalSchema,
  blockSchema,
  extractSchema,
} from '../../schemas/v1/account';

export class AccountController {
  protected accountService: AccountService;

  constructor (container: Container) {
    this.accountService = container.accountService;
  }

  register(router: Router): void {
    router.post(
      '/v1/account',
      this.create.bind(this),
    );
    router.patch(
      '/v1/account/deposit/:id',
      this.deposit.bind(this),
    );
    router.patch(
      '/v1/account/withdrawal/:id',
      this.withdrawal.bind(this),
    );
    router.patch(
      '/v1/account/block/:id',
      this.block.bind(this),
    );
    router.get(
      '/v1/account/balance/:id',
      this.balance.bind(this),
    );
    router.get(
      '/v1/account/extract/:id',
      this.extract.bind(this),
    );
  }

  async create(req: Request, res: Response) {
    try {
      const { error } = createAccountSchema.validate(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const data: CreateAccountRequestData = req.body;
      await this.accountService.create(data);
      res.status(201).send('Created');
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async deposit(req: Request, res: Response) {
    try {
      const { error } = depositSchema.validate(req, { allowUnknown: true });
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const accountId = Number(req.params.id);
      const { amount } = req.body;

      const response = await this.accountService.deposit(accountId, amount);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async withdrawal(req: Request, res: Response) {
    try {
      const { error } = withdrawalSchema.validate(req, { allowUnknown: true });
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const accountId = Number(req.params.id);
      const { amount } = req.body;

      const response = await this.accountService.withdrawal(accountId, amount);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async block(req: Request, res: Response) {
    try {
      const { error } = blockSchema.validate(req, { allowUnknown: true });
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const accountId = Number(req.params.id);
      await this.accountService.block(accountId);
      res.status(204).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async balance(req: Request, res: Response) {
    try {
      const { error } = balanceSchema.validate(req, { allowUnknown: true });
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const accountId = Number(req.params.id);

      const response = await this.accountService.getBalance(accountId);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async extract(req: Request, res: Response) {
    try {
      const { error } = extractSchema.validate(req, { allowUnknown: true });
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const accountId = Number(req.params.id);

      const query = req.query;

      const initialDate = query.initialDate ? String(query.initialDate) : null;
      const finalDate = query.finalDate ? String(query.finalDate) : null;

      const response = await this.accountService.getExtract(accountId, initialDate, finalDate);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

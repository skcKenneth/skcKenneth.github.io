import { DurableObject } from "cloudflare:workers";
import { handleAsk } from "./ask.mjs";
import { createQuotaTable, reserveQuestion } from "./quota.mjs";

export class SelahQuota extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    createQuotaTable(ctx.storage.sql);
  }

  reserve() {
    return reserveQuestion(this.ctx.storage.sql);
  }
}

export default { fetch: handleAsk };

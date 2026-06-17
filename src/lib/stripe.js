import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRICE_ID = {
  collaborator_pro: "price_1Tg94WBobJ95YQ8phQiwasxJ",
  collaborator_premium: "price_1Tg9r4BobJ95YQ8pdZl7B5Dn",
  founder_growth: "price_1TgA3gBobJ95YQ8pZzrFseoW",
  founder_enterprise: "price_1TgA4lBobJ95YQ8pHzxSiDpu",
};

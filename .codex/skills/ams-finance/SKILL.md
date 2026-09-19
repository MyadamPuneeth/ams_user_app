---
name: ams-finance
description: Implement or review AMS fee plans, invoices, Razorpay collection, manual payments, refunds, expenses, payroll and financial reporting. Use when changing money movement or financial records.
---

# AMS finance

Read [finance](../../context/finance.md), [domain model](../../context/domain-model.md) and [permissions](../../context/permissions.md). Consult current official Razorpay documentation for provider-specific APIs.

## Workflow

- Establish the academy, currency, source document and authorized actor before processing an operation.
- Keep invoice obligations, captured payments, allocations, refunds and actual salary payments separate. Use integer paise and explicit rounding rules for percentage calculations.
- Preserve issued/finalized records through audited adjustments; do not silently edit historical amounts or delete ledger evidence.
- Create provider orders from server amounts and use the academy's own credentials. Checkout UI success is not proof of collection.
- Verify signatures, provider account, order, amount, currency and captured status. Make callbacks, webhooks and reconciliation converge on one recorded payment.
- Protect partial allocations and refundable balances against concurrent operations. Retain pending/failed states until the provider confirms the result.
- Keep recurring invoice and payroll generation idempotent. Snapshot finalized payroll inputs and record salary payment separately.
- Do not invent statutory calculations, tax rates, platform commissions or salary bank transfers. They are outside the agreed behavior.
- Use test-mode credentials or deterministic provider doubles during development; never place secrets in fixtures or logs.

## Verification

Prioritize ledger reconciliation, duplicate/out-of-order events, invalid signatures, cross-academy references, partial payments, refund races, period boundaries and payroll finalization. Verify report totals against source transactions, including reversals and pending states.

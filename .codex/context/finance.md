# Finance and salary management

Status: intended behavior. Launch market is India, currency INR. Financial formulas and tax treatment must be explicit configuration; this document does not establish legal or tax compliance.

## Fees and billing

Fee plans support recurring fees, instalments and explicit discounts. An assignment connects the plan to an athlete. Generate invoices idempotently per assignment and billing period; retrying a job must not issue duplicates.

Store money in integer paise. Preserve line-item amounts, due dates, discounts and applicable configured tax inputs on issued documents. Do not infer a universal tax rate. Outstanding balance derives from invoices, credits, allocations and reversals rather than an independently editable paid flag.

Record cash/bank/manual payments with date, amount, method, reference and responsible staff member. Allocate partial payments to invoices; make excess/unallocated credit visible. Issue a receipt for recorded collection with an academy-scoped identifier.

Finalized documents remain historical records. Correct using recorded adjustments, void/reissue where appropriate, credit notes or reversals. Keep reason and author; do not silently replace old amounts.

## Online collection

Each academy uses its own Razorpay account for academy fees and tournament entry payments. Funds settle directly to the academy; platform commissions and shared settlement are outside launch scope.

- Store encrypted provider credentials server-side. Distinguish test and live environments.
- Create provider orders from validated server-side amounts and invoice/entry references.
- Validate payment signatures, academy/provider account, order, currency and amount. Browser checkout success is not authoritative.
- Record collection only after captured payment is verified. Authorized-only, failed or uncertain status is not paid.
- Verify webhook signatures against raw request bytes. Deduplicate event processing and payment identity; tolerate delayed and out-of-order delivery.
- Use transactional updates and reconciliation against provider state so callback/webhook races cannot duplicate collection.
- Persist reconciliation failures for retry and staff visibility; do not convert unknown status into success.

Refunds reference the original payment and cannot exceed its remaining refundable amount. Online refunds use the original provider account and remain pending until provider confirmation. Manual refunds record the external reference. Concurrent refunds need transaction-level protection. Apply resulting invoice/entry effects once.

## Expenses and payroll

Expenses have category, date, amount, branch where applicable, evidence and author. Financial reports distinguish money received/paid, outstanding obligations and refunds; do not present basic totals as full statutory accounting.

Staff salary structures have effective dates and configured earnings/deductions. A payroll period snapshots its inputs; staff attendance may inform deductions using an explicit configured formula. Review before finalization, issue payslips, and record actual salary payments separately. Re-running generation cannot duplicate finalized payslips.

Statutory deductions/calculations/filings are external, even when staff manually enter a deduction amount. This system does not initiate salary bank transfers.

## Verification focus

Test duplicate/out-of-order webhook delivery, invalid signatures, cross-academy references, captured versus authorized payments, partial allocations, credits, concurrent refunds, failed refunds, billing retries, period boundaries and finalized payroll corrections.

References: [Razorpay server integration](https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/), [Razorpay integration security](https://security.razorpay.com/security/checklist/). Check current provider documentation when implementing APIs.

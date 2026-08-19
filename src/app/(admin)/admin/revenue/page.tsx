import { adminClient } from "@/lib/supabase/admin";

type Purchase = {
  id: string;
  user_id: string | null;
  product: string;
  stripe_checkout_session_id: string;
  amount_total: number;
  amount_refunded: number;
  currency: string;
  payment_status: string;
  fulfillment_status: string;
  action_required: boolean;
  paid_at: string;
};

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
}

export default async function RevenuePage() {
  const db = adminClient();
  const [{ data: purchaseRows, error }, { count: unmatchedEvents }] = await Promise.all([
    db.from("stripe_purchases")
      .select("id, user_id, product, stripe_checkout_session_id, amount_total, amount_refunded, currency, payment_status, fulfillment_status, action_required, paid_at")
      .order("paid_at", { ascending: false })
      .limit(200),
    db.from("stripe_payment_events")
      .select("event_id", { count: "exact", head: true })
      .eq("processing_status", "unmatched"),
  ]);
  if (error) throw new Error(error.message);
  const purchases = (purchaseRows ?? []) as Purchase[];
  const gross = purchases.reduce((sum, purchase) => sum + purchase.amount_total, 0);
  const refunded = purchases.reduce((sum, purchase) => sum + purchase.amount_refunded, 0);
  const currency = purchases[0]?.currency ?? "usd";
  const reviewCount = purchases.filter((purchase) => purchase.action_required).length;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-foreground">Revenue & fulfillment</h1>
        <p className="mt-1 text-sm text-muted">Stripe purchases, refunds, disputes, and items requiring review.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          ["Gross recorded", money(gross, currency)],
          ["Refunded", money(refunded, currency)],
          ["Needs review", String(reviewCount)],
          ["Unmatched events", String(unmatchedEvents ?? 0)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 text-2xl font-extrabold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-gray-50 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Date</th><th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Amount</th><th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Fulfillment</th><th className="px-4 py-3">Checkout</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className={`border-b border-border last:border-0 ${purchase.action_required ? "bg-amber-50" : ""}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(purchase.paid_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold capitalize">{purchase.product.replaceAll("_", " ")}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {money(purchase.amount_total, purchase.currency)}
                    {purchase.amount_refunded > 0 && <span className="ml-1 text-xs text-red-600">−{money(purchase.amount_refunded, purchase.currency)}</span>}
                  </td>
                  <td className="px-4 py-3 capitalize">{purchase.payment_status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 capitalize">{purchase.fulfillment_status.replaceAll("_", " ")}</td>
                  <td className="max-w-48 truncate px-4 py-3 font-mono text-xs text-muted" title={purchase.stripe_checkout_session_id}>
                    {purchase.stripe_checkout_session_id}
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-muted">No Stripe purchases recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

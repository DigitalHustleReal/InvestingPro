"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Receipt, FileText, Calculator, Plus, Trash2, CheckCircle,
  AlertTriangle, Info, TrendingUp, Building2, ChevronDown, ChevronUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  hsnSac: string;
}

type TransactionType = "intrastate" | "interstate";

interface GSTRSummary {
  month: string;
  sales: number;
  purchases: number;
  outputGST: number;
  inputGST: number;
  itcClaim: number;
  netGSTPayable: number;
}

// ── Constants ──────────────────────────────────────────────────────

const GST_RATES = [0, 3, 5, 12, 18, 28];

const HSN_SUGGESTIONS = [
  { code: "9983", desc: "Professional Services / Consulting" },
  { code: "9985", desc: "IT Services / Software" },
  { code: "9954", desc: "Construction Services" },
  { code: "9971", desc: "Financial Services" },
  { code: "8471", desc: "Computers & Laptops" },
  { code: "8517", desc: "Mobile Phones" },
  { code: "3004", desc: "Medicines / Pharmaceuticals" },
  { code: "2106", desc: "Packaged Food" },
  { code: "6101", desc: "Garments / Clothing" },
  { code: "7308", desc: "Iron & Steel Structures" },
];

const MONTHS = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March",
];

// ── Helpers ────────────────────────────────────────────────────────

function fmtINR(n: number, decimals = 2) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function fmtINRShort(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

let nextId = 1;
function makeItem(overrides?: Partial<InvoiceItem>): InvoiceItem {
  return { id: nextId++, description: "", quantity: 1, unitPrice: 0, gstRate: 18, hsnSac: "", ...overrides };
}

// ── Tab 1: Multi-Item Invoice ──────────────────────────────────────

function InvoiceCalculator() {
  const [items, setItems] = useState<InvoiceItem[]>([
    makeItem({ description: "Product / Service", unitPrice: 10000 }),
  ]);
  const [txnType, setTxnType] = useState<TransactionType>("intrastate");
  const [showHSN, setShowHSN] = useState(false);

  const addItem = () => setItems((p) => [...p, makeItem()]);
  const removeItem = (id: number) => setItems((p) => p.filter((i) => i.id !== id));
  const updateItem = <K extends keyof InvoiceItem>(id: number, k: K, v: InvoiceItem[K]) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [k]: v } : i)));

  const totals = useMemo(() => {
    let subtotal = 0, totalGST = 0;
    const rows = items.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      const gst = (lineTotal * item.gstRate) / 100;
      subtotal += lineTotal;
      totalGST += gst;
      return { ...item, lineTotal, gst, cgst: gst / 2, sgst: gst / 2 };
    });
    return { rows, subtotal, totalGST, grandTotal: subtotal + totalGST, cgst: totalGST / 2, sgst: totalGST / 2 };
  }, [items]);

  return (
    <div className="space-y-5">
      {/* Transaction type */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transaction Type:</span>
        {(["intrastate", "interstate"] as TransactionType[]).map((t) => (
          <button key={t} onClick={() => setTxnType(t)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all",
              txnType === t ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600"
            )}>
            {t === "intrastate" ? "Intra-state (CGST + SGST)" : "Inter-state (IGST)"}
          </button>
        ))}
      </div>

      {/* Items table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[700px]">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {["#", "Description", "HSN/SAC", "Qty", "Unit Price", "GST %", "GST Amt", "Total", ""].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {totals.rows.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-3 py-2.5 text-sm text-slate-500">{idx + 1}</td>
                <td className="px-3 py-2.5">
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="w-full min-w-[150px] px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700"
                    placeholder="Item description"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <input
                    value={item.hsnSac}
                    onChange={(e) => updateItem(item.id, "hsnSac", e.target.value)}
                    className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700"
                    placeholder="HSN/SAC"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <input
                    type="number" min={1} value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-16 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <input
                    type="number" min={0} value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                    className="w-28 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <select
                    value={item.gstRate}
                    onChange={(e) => updateItem(item.id, "gstRate", Number(e.target.value))}
                    className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700"
                  >
                    {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5 text-sm font-medium text-primary-600 whitespace-nowrap">{fmtINR(item.gst)}</td>
                <td className="px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{fmtINR(item.lineTotal + item.gst)}</td>
                <td className="px-3 py-2.5">
                  <button onClick={() => removeItem(item.id)} disabled={items.length === 1}
                    className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-primary-300 rounded-xl text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all w-full justify-center">
        <Plus className="w-4 h-4" /> Add Item
      </button>

      {/* Invoice summary */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal (before GST)</span>
          <span className="font-semibold text-slate-900 dark:text-white">{fmtINR(totals.subtotal)}</span>
        </div>
        {txnType === "intrastate" ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">CGST</span>
              <span className="font-medium text-slate-700">{fmtINR(totals.cgst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">SGST</span>
              <span className="font-medium text-slate-700">{fmtINR(totals.sgst)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">IGST</span>
            <span className="font-medium text-slate-700">{fmtINR(totals.totalGST)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
          <span className="text-slate-900 dark:text-white">Grand Total</span>
          <span className="text-primary-700">{fmtINR(totals.grandTotal)}</span>
        </div>
      </div>

      {/* HSN reference */}
      <div>
        <button onClick={() => setShowHSN(!showHSN)}
          className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
          {showHSN ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Common HSN/SAC Codes
        </button>
        {showHSN && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {HSN_SUGGESTIONS.map((h) => (
              <div key={h.code} className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                <code className="font-mono font-bold text-primary-600">{h.code}</code>
                <span className="text-slate-600 dark:text-slate-400">{h.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab 2: Monthly GSTR Filing Estimator ──────────────────────────

function GSTREstimator() {
  const [sales, setSales] = useState(500000);
  const [purchases, setPurchases] = useState(200000);
  const [salesGstPct, setSalesGstPct] = useState(18);
  const [purchaseGstPct, setPurchaseGstPct] = useState(18);
  const [exemptSalesPct, setExemptSalesPct] = useState(0);

  const result = useMemo(() => {
    const taxableSales = sales * (1 - exemptSalesPct / 100);
    const outputGST = (taxableSales * salesGstPct) / 100;
    const inputGST = (purchases * purchaseGstPct) / 100;
    const netGSTPayable = Math.max(0, outputGST - inputGST);
    const itcUtilised = Math.min(outputGST, inputGST);
    const itcCarryForward = Math.max(0, inputGST - outputGST);

    const gstr1DueDate = "11th of next month (monthly filer)";
    const gstr3bDueDate = "20th of next month (turnover > ₹5 Cr) / 22nd or 24th (others)";

    return {
      taxableSales, outputGST, inputGST, netGSTPayable,
      itcUtilised, itcCarryForward, gstr1DueDate, gstr3bDueDate,
      cgstPayable: netGSTPayable / 2, sgstPayable: netGSTPayable / 2,
      annualGSTPayable: netGSTPayable * 12,
    };
  }, [sales, purchases, salesGstPct, purchaseGstPct, exemptSalesPct]);

  return (
    <div className="space-y-5">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 flex gap-2">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p>Estimates your monthly GSTR-3B liability. Enter your average monthly sales and purchases (excluding GST).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {[
          { label: "Monthly Sales (excl. GST)", value: sales, setter: setSales, max: 10000000, hint: "Total sales before GST" },
          { label: "Monthly Purchases (excl. GST)", value: purchases, setter: setPurchases, max: 10000000, hint: "ITC-eligible purchases" },
        ].map(({ label, value, setter, max, hint }) => (
          <div key={label}>
            <div className="flex justify-between mb-1.5">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
                <p className="text-xs text-slate-400">{hint}</p>
              </div>
              <span className="text-sm font-bold text-primary-600">{fmtINRShort(value)}</span>
            </div>
            <input type="range" min={0} max={max} step={10000} value={value}
              onChange={(e) => setter(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
          </div>
        ))}

        {[
          { label: "GST Rate on Sales", value: salesGstPct, setter: setSalesGstPct },
          { label: "GST Rate on Purchases", value: purchaseGstPct, setter: setPurchaseGstPct },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">{label}</label>
            <div className="flex flex-wrap gap-2">
              {GST_RATES.map((r) => (
                <button key={r} onClick={() => setter(r)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all",
                    value === r ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600"
                  )}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className="flex justify-between mb-1.5">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exempt/Zero-rated Sales</label>
              <p className="text-xs text-slate-400">% of sales that are GST exempt</p>
            </div>
            <span className="text-sm font-bold text-slate-500">{exemptSalesPct}%</span>
          </div>
          <input type="range" min={0} max={100} step={5} value={exemptSalesPct}
            onChange={(e) => setExemptSalesPct(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-400" />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Output GST", value: fmtINR(result.outputGST), sub: "you collected", accent: "text-slate-900 dark:text-white" },
          { label: "Input ITC", value: fmtINR(result.inputGST), sub: "you paid on purchases", accent: "text-green-600" },
          { label: "ITC Utilised", value: fmtINR(result.itcUtilised), sub: "offset against output", accent: "text-blue-600" },
          { label: "Net GST Payable", value: fmtINR(result.netGSTPayable), sub: "this month to govt", accent: result.netGSTPayable > 0 ? "text-red-600" : "text-green-600" },
        ].map((item) => (
          <div key={item.label} className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={cn("text-lg font-bold", item.accent)}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* GSTR-3B breakdown */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 space-y-3">
        <p className="text-sm font-bold text-slate-900 dark:text-white">GSTR-3B This Month</p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Taxable Sales</span>
              <span className="font-medium">{fmtINR(result.taxableSales)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Output CGST ({salesGstPct / 2}%)</span>
              <span className="font-medium">{fmtINR(result.outputGST / 2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Output SGST ({salesGstPct / 2}%)</span>
              <span className="font-medium">{fmtINR(result.outputGST / 2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-green-700">
              <span>ITC Available</span>
              <span className="font-bold">- {fmtINR(result.inputGST)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-600 pt-2">
              <span>Net Payable (CGST)</span>
              <span className="text-primary-700">{fmtINR(result.cgstPayable)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Net Payable (SGST)</span>
              <span className="text-primary-700">{fmtINR(result.sgstPayable)}</span>
            </div>
          </div>
        </div>
        {result.itcCarryForward > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2 text-sm text-green-800">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>ITC Carry Forward to next month: <strong>{fmtINR(result.itcCarryForward)}</strong></span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {[
          { icon: Receipt, label: "GSTR-1 Due Date", value: result.gstr1DueDate },
          { icon: FileText, label: "GSTR-3B Due Date", value: result.gstr3bDueDate },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Icon className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">{label}</p>
              <p className="text-amber-700 text-xs mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab 3: Composition Scheme Eligibility ─────────────────────────

function CompositionSchemeChecker() {
  const [annualTurnover, setAnnualTurnover] = useState(5000000);
  const [businessType, setBusinessType] = useState<"goods" | "restaurant" | "services">("goods");
  const [supplyType, setSupplyType] = useState<"intrastate" | "interstate">("intrastate");
  const [hasEcommerce, setHasEcommerce] = useState(false);
  const [hasCasualTaxable, setHasCasualTaxable] = useState(false);

  const result = useMemo(() => {
    const limitGoods = 15000000;       // ₹1.5 Cr
    const limitServices = 5000000;     // ₹50 L
    const limitRestaurant = 15000000;  // ₹1.5 Cr

    const limit = businessType === "services" ? limitServices : limitGoods;
    const isEligibleByTurnover = annualTurnover <= limit;
    const isEligibleByOtherRules = !hasEcommerce && !hasCasualTaxable && supplyType === "intrastate";

    const eligible = isEligibleByTurnover && isEligibleByOtherRules;

    // Composition rates
    const compositionRates = {
      goods: { rate: 1, label: "1% of turnover (0.5% CGST + 0.5% SGST)" },
      restaurant: { rate: 5, label: "5% of turnover (2.5% CGST + 2.5% SGST)" },
      services: { rate: 6, label: "6% of turnover (3% CGST + 3% SGST)" },
    };
    const compRate = compositionRates[businessType];

    // Regular GST estimate (assuming 18%)
    const regularGSTLiability = (annualTurnover * 18) / 100;
    const compositionGSTLiability = (annualTurnover * compRate.rate) / 100;
    const annualSaving = eligible ? regularGSTLiability - compositionGSTLiability : 0;

    const disqualifiers: string[] = [];
    if (!isEligibleByTurnover)
      disqualifiers.push(`Turnover ₹${(annualTurnover / 100000).toFixed(0)}L exceeds limit of ₹${(limit / 100000).toFixed(0)}L`);
    if (hasEcommerce)
      disqualifiers.push("E-commerce operators/suppliers via e-commerce cannot opt for composition");
    if (hasCasualTaxable)
      disqualifiers.push("Casual taxable persons are not eligible");
    if (supplyType === "interstate")
      disqualifiers.push("Inter-state supply of goods is not allowed under composition scheme");

    return {
      eligible, limit, compositionRate: compRate, regularGSTLiability,
      compositionGSTLiability, annualSaving, disqualifiers, isEligibleByTurnover,
    };
  }, [annualTurnover, businessType, supplyType, hasEcommerce, hasCasualTaxable]);

  return (
    <div className="space-y-5">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 flex gap-2">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p>The Composition Scheme (Section 10 of CGST Act) allows small businesses to pay GST at a flat rate instead of the regular slab rate — with less compliance. Check if your business qualifies.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Annual Turnover */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Annual Turnover</label>
            <span className="text-sm font-bold text-primary-600">{fmtINRShort(annualTurnover)}</span>
          </div>
          <input type="range" min={500000} max={20000000} step={100000} value={annualTurnover}
            onChange={(e) => setAnnualTurnover(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
          <div className="flex justify-between text-xs text-slate-400 mt-0.5">
            <span>₹5 L</span><span>₹2 Cr</span>
          </div>
        </div>

        {/* Business type */}
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Business Type</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "goods", label: "Goods Trader" },
              { value: "restaurant", label: "Restaurant" },
              { value: "services", label: "Services" },
            ] as { value: typeof businessType; label: string }[]).map((t) => (
              <button key={t.value} onClick={() => setBusinessType(t.value)}
                className={cn(
                  "py-2 px-2 rounded-lg text-sm font-semibold border transition-all text-center",
                  businessType === t.value ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600"
                )}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disqualifiers */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Supply inter-state?", value: supplyType === "interstate", setter: (v: boolean) => setSupplyType(v ? "interstate" : "intrastate"), desc: "Goods across state borders" },
          { label: "Sell via e-commerce?", value: hasEcommerce, setter: setHasEcommerce, desc: "Amazon, Flipkart, Meesho, etc." },
          { label: "Casual taxable person?", value: hasCasualTaxable, setter: setHasCasualTaxable, desc: "Seasonal / temporary GST reg." },
        ].map(({ label, value, setter, desc }) => (
          <div key={label} className={cn("p-3 rounded-xl border flex items-start gap-3", value ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50 dark:bg-slate-800")}>
            <button onClick={() => setter(!value)}
              className={cn("relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5",
                value ? "bg-red-500" : "bg-slate-300"
              )}>
              <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", value && "translate-x-5")} />
            </button>
            <div>
              <p className={cn("text-sm font-semibold", value ? "text-red-800" : "text-slate-700 dark:text-slate-300")}>{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      {result.eligible ? (
        <Card className="border-2 border-green-300 bg-green-50 dark:bg-green-950 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900 dark:text-green-100 text-lg">Eligible for Composition Scheme</p>
                <p className="text-sm text-green-800 dark:text-green-200">Your turnover of {fmtINRShort(annualTurnover)} is within the ₹{(result.limit / 100000).toFixed(0)} L limit and no disqualifiers apply.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-white/60 rounded-xl">
                <p className="text-xs text-slate-500 mb-0.5">Composition Rate</p>
                <p className="font-bold text-green-700">{result.compositionRate.rate}%</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl">
                <p className="text-xs text-slate-500 mb-0.5">Annual GST (Composition)</p>
                <p className="font-bold text-green-700">{fmtINRShort(result.compositionGSTLiability)}</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-xl">
                <p className="text-xs text-slate-500 mb-0.5">Annual Saving vs Regular</p>
                <p className="font-bold text-primary-700">{fmtINRShort(result.annualSaving)}</p>
              </div>
            </div>
            <div className="text-sm text-green-800 space-y-1.5">
              <p className="font-semibold">Composition rate: {result.compositionRate.label}</p>
              <p className="text-xs leading-relaxed">
                Benefits: No invoice-level GST, file one quarterly return (CMP-08), much lower compliance cost.
                Drawback: Cannot claim ITC, cannot issue tax invoices to B2B customers.
                File CMP-01/CMP-02 to opt in. Cannot collect GST from customers — absorb it in your pricing.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-950 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-7 h-7 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-900 dark:text-red-100 text-lg">Not Eligible for Composition Scheme</p>
                <p className="text-sm text-red-800 mt-0.5">You must file under the regular GST scheme.</p>
              </div>
            </div>
            <div className="space-y-2">
              {result.disqualifiers.map((d, i) => (
                <div key={i} className="flex gap-2 text-sm text-red-800 bg-white/50 rounded-lg p-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────

const TABS = [
  { id: "invoice", label: "Multi-Item Invoice", icon: Receipt },
  { id: "gstr", label: "GSTR Filing Estimator", icon: FileText },
  { id: "composition", label: "Composition Scheme", icon: Building2 },
] as const;

type TabId = typeof TABS[number]["id"];

export function GSTSuite() {
  const [activeTab, setActiveTab] = useState<TabId>("invoice");

  return (
    <div className="space-y-5">
      {/* Tab picker */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all",
              activeTab === id
                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              {activeTab === "invoice" && <Receipt className="w-5 h-5 text-primary-600" />}
              {activeTab === "gstr" && <FileText className="w-5 h-5 text-primary-600" />}
              {activeTab === "composition" && <Building2 className="w-5 h-5 text-primary-600" />}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {activeTab === "invoice" && "Multi-Item GST Invoice Calculator"}
                {activeTab === "gstr" && "Monthly GSTR Filing Estimator"}
                {activeTab === "composition" && "Composition Scheme Eligibility Checker"}
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "invoice" && "Add multiple items with different GST rates — auto-generates CGST/SGST or IGST breakdown"}
                {activeTab === "gstr" && "Estimate your monthly GSTR-3B liability with ITC offset calculation"}
                {activeTab === "composition" && "Check if your business can opt for lower flat-rate GST under Composition Scheme"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "invoice" && <InvoiceCalculator />}
          {activeTab === "gstr" && <GSTREstimator />}
          {activeTab === "composition" && <CompositionSchemeChecker />}
        </CardContent>
      </Card>
    </div>
  );
}

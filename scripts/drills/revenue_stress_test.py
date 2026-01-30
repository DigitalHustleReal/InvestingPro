
import math

def run_simulation(name, mau, conversion_rate, rpc, fixed_costs, ai_variable_cost):
    """
    mau: Monthly Active Users
    conversion_rate: % of users who click an affiliate link (e.g. 0.05 for 5%)
    rpc: Revenue Per Click (average commission per successful acquisition * approval rate)
    fixed_costs: Monthly fixed expenses (Server, Hosting, Salaries)
    ai_variable_cost: AI cost per 1000 visitors
    """
    total_clicks = mau * conversion_rate
    gross_revenue = total_clicks * rpc
    
    # AI cost is roughly $1/day hard limit now ($30/mo) but scaled for traffic
    # Assuming $1/10k visitors for high-efficiency tiering
    total_ai_cost = (mau / 10000) * 30 
    
    total_expenses = fixed_costs + total_ai_cost
    net_profit = gross_revenue - total_expenses
    
    print(f"\n--- Scenario: {name} ---")
    print(f"📊 Traffic: {mau:,} MAU")
    print(f"🖱️ Clicks: {int(total_clicks):,}")
    print(f"💰 Gross Revenue: ₹{gross_revenue:,.2f}")
    print(f"💸 Expenses (Fixed + AI): ₹{total_expenses:,.2f}")
    print(f"📈 Net Profit: ₹{net_profit:,.2f}")
    print(f"🏁 Profit Margin: {(net_profit/gross_revenue)*100:.1f}%" if gross_revenue > 0 else "N/A")
    
    return net_profit

def main():
    print("📈 InvestingPro.in - Revenue Model Stress-Test (Audit 13)")
    
    # 2030 Goal: ₹60Cr/Year = ₹5Cr/Month
    fixed_monthly_costs = 200000  # ₹2 Lakhs (Lean operations)
    
    # Scenario 1: The "Gold" Roadmap (₹60Cr Goal)
    # 1M MAU @ 5% CR @ ₹100 ARPU
    run_simulation("Roadmap to 2030 (Goal)", 1000000, 0.05, 100, fixed_monthly_costs, 5000)
    
    # Scenario 2: Realistic Launch Year (Conservative)
    # 50k MAU @ 2% CR @ ₹50 ARPU
    run_simulation("Realistic Year 1 (Conservative)", 50000, 0.02, 50, fixed_monthly_costs, 500)
    
    # Scenario 3: Survival Scenario (50% traffic drop)
    # 25k MAU @ 2% CR @ ₹50 ARPU
    run_simulation("SURVIVAL (50% Traffic Drop)", 25000, 0.02, 50, fixed_monthly_costs, 250)
    
    # Scenario 4: High Growth / High Efficiency
    # 500k MAU @ 8% CR @ ₹150 ARPU
    run_simulation("High Efficiency (Optimized Funnels)", 500000, 0.08, 150, fixed_monthly_costs, 2500)

if __name__ == "__main__":
    main()

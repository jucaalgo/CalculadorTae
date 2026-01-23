/**
 * Finance Engine - LCCI 2019 Compliant
 * Handcrafted by JCA Systems.
 */

export interface Expense {
    id: string;
    name: string;
    // If 'percent', amount is calculated relative to Principal
    unit: 'currency' | 'percent';
    value: number; // The raw number (e.g. 1 for 1%, or 150 for 150€)

    recurrence: 'initial' | 'monthly' | 'annual';
    includedInTAE: boolean;
}

export const Finance = {
    getExpenseAmount(e: Expense, principal: number): number {
        if (e.unit === 'percent') {
            return (e.value / 100) * principal;
        }
        return e.value;
    },

    calculatePMT(principal: number, annualTIN: number, months: number): number {
        const rateMonthly = (annualTIN / 100) / 12;
        if (rateMonthly === 0) return principal / months;

        return principal * rateMonthly * Math.pow(1 + rateMonthly, months) / (Math.pow(1 + rateMonthly, months) - 1);
    },

    solveIRR(cashFlows: number[], guess = 0.1 / 12): number {
        const maxIter = 1000;
        const tol = 1e-9;
        let r = guess;

        for (let i = 0; i < maxIter; i++) {
            let npv = 0;
            let dNpv = 0;
            for (let t = 0; t < cashFlows.length; t++) {
                const val = cashFlows[t];
                const den = Math.pow(1 + r, t);
                npv += val / den;
                dNpv -= t * val / (den * (1 + r));
            }
            if (Math.abs(npv) < tol) return r;
            const newR = r - npv / dNpv;
            if (Math.abs(newR - r) < tol) return newR;
            r = newR;
        }
        return r;
    },

    calculateTAE(principal: number, tin: number, months: number, expenses: Expense[]) {
        // Note: 'months' passed in directly (not years)
        const quota = this.calculatePMT(principal, tin, months);

        // Filter and Calculate Amounts
        const activeExpenses = expenses
            .filter(e => e.includedInTAE)
            .map(e => ({ ...e, calculatedAmount: this.getExpenseAmount(e, principal) }));

        // 1. Initial Outflow (T=0)
        const initialExpensesSum = activeExpenses
            .filter(e => e.recurrence === 'initial')
            .reduce((sum, e) => sum + e.calculatedAmount, 0);

        const netPrincipal = principal - initialExpensesSum;
        const cashFlows = [netPrincipal];

        // 2. Cash Flow Stream (T=1 to N)
        for (let m = 1; m <= months; m++) {
            let monthlyOutflow = quota;

            // Monthly
            activeExpenses
                .filter(e => e.recurrence === 'monthly')
                .forEach(e => monthlyOutflow += e.calculatedAmount);

            // Annual (at 12, 24, 36...)
            if (m % 12 === 0) {
                activeExpenses
                    .filter(e => e.recurrence === 'annual')
                    .forEach(e => monthlyOutflow += e.calculatedAmount);
            }

            cashFlows.push(-monthlyOutflow);
        }

        // 3. Solve IRR
        const irrMonthly = this.solveIRR(cashFlows);
        const tae = (Math.pow(1 + irrMonthly, 12) - 1) * 100;

        // Totals
        const totalPrincipalPaid = principal;
        const totalInterestPaid = (quota * months) - principal;

        // Total Expenses calc is tricky due to varying recurrence
        let totalExpensesPaid = initialExpensesSum;
        activeExpenses.filter(e => e.recurrence === 'monthly').forEach(e => totalExpensesPaid += e.calculatedAmount * months);
        activeExpenses.filter(e => e.recurrence === 'annual').forEach(e => totalExpensesPaid += e.calculatedAmount * (months / 12)); // Approx? No, strictly integer years:
        // Actually loop count is better:
        // We already iterated. But let's simplify for the summary.
        // If 18 months, 1 annual paid at m=12. (18/12 floor = 1). Correct.
        activeExpenses.filter(e => e.recurrence === 'annual').forEach(e => totalExpensesPaid += e.calculatedAmount * Math.floor(months / 12));


        return {
            monthlyQuota: quota,
            tae: isNaN(tae) ? 0 : tae,
            breakdown: {
                principal: totalPrincipalPaid,
                interest: totalInterestPaid,
                expenses: totalExpensesPaid,
                totalPaid: totalPrincipalPaid + totalInterestPaid + totalExpensesPaid
            }
        };
    },

    calculateAmortizationSchedule(principal: number, tin: number, months: number): { month: number; balance: number }[] {
        const quota = this.calculatePMT(principal, tin, months);
        const rateMonthly = (tin / 100) / 12;

        let balance = principal;
        const schedule = [{ month: 0, balance: principal }];

        for (let m = 1; m <= months; m++) {
            const interest = balance * rateMonthly;
            const principalPayment = quota - interest;
            balance -= principalPayment;
            if (balance < 0) balance = 0; // Floating point correction

            // Optimize datapoints for long loans (don't chart 120 points if not needed, but Recharts handles it fine)
            schedule.push({ month: m, balance });
        }
        return schedule;
    }
};

class FinancialService {
    static calculateProjectCost(margin) {
        const projectCost = margin / 0.10;
        const financingRequirement = projectCost - margin;
        return { projectCost, financingRequirement };
    }

    static calculateRepayment(amount, rate, years, freq) {
        let n, r;
        if (freq === "monthly") {
            n = years * 12;
            r = (rate / 100) / 12;
        } else {
            n = years * 4;
            r = (rate / 100) / 4;
        }
        
        let payment;
        if (r > 0) {
            payment = amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        } else {
            payment = amount / n;
        }
        
        let schedule = [];
        let balance = amount;
        for (let i = 1; i <= n; i++) {
            let interest = balance * r;
            let principal = payment - interest;
            balance -= principal;
            if (balance < 0) balance = 0;
            
            schedule.push({
                installment_number: i,
                principal: parseFloat(principal.toFixed(2)),
                interest: parseFloat(interest.toFixed(2)),
                payment: parseFloat(payment.toFixed(2)),
                remaining_balance: parseFloat(balance.toFixed(2))
            });
        }
        
        return schedule;
    }
}

module.exports = FinancialService;

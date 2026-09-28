class SchemeRouter {
    static recommend(projectCost, margin) {
        const financing = projectCost * 0.90;
        
        if (projectCost <= 140000) {
            const maxLoan = 125000;
            const recommendedLoan = Math.min(financing, maxLoan);
            return {
                scheme: "MICRO FINANCE SCHEME",
                project_cost: projectCost,
                calculated_financing: financing,
                eligible_loan_limit: maxLoan,
                recommended_loan: recommendedLoan,
                interest_rate: 6.5,
                tenure_years: 3,
                moratorium_months: 3,
                source: "NSFDC scheme parameters – prototype implementation"
            };
        } else if (projectCost <= 5000000) {
            const maxLoan = 4500000;
            const recommendedLoan = Math.min(financing, maxLoan);
            return {
                scheme: "TERM LOAN SCHEME",
                project_cost: projectCost,
                calculated_financing: financing,
                eligible_loan_limit: maxLoan,
                recommended_loan: recommendedLoan,
                interest_rate: 8.0,
                tenure_years: 7,
                moratorium_months: 6,
                source: "NSFDC scheme parameters – prototype implementation"
            };
        } else {
            return {
                scheme: "NOT ELIGIBLE (Exceeds maximum project cost of 50 Lakhs)",
                project_cost: projectCost,
                calculated_financing: financing,
                eligible_loan_limit: 0,
                recommended_loan: 0,
                interest_rate: 0,
                tenure_years: 0,
                moratorium_months: 0,
                source: "NSFDC scheme parameters – prototype implementation"
            };
        }
    }
}

module.exports = SchemeRouter;

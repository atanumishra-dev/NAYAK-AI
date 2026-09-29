#!/bin/bash
cd backend

cat << 'INNEREOF' > package.json
{
  "name": "nayakai-backend",
  "version": "1.0.0",
  "description": "Prototype backend for Nayak AI",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^7.5.0"
  },
  "devDependencies": {
    "jest": "^29.6.4",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
INNEREOF

cat << 'INNEREOF' > .env.example
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/nayakai
LLM_API_KEY=
LLM_PROVIDER=mock
INNEREOF

cat << 'INNEREOF' > README.md
# Nayak AI Backend
Prototype Node.js backend for Nayak AI (SIH 2026).
INNEREOF

mkdir -p config models routes services tests

cat << 'INNEREOF' > server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');
const locationRoutes = require('./routes/locations');
const businessRoutes = require('./routes/businesses');
const financeRoutes = require('./routes/finance');
const schemeRoutes = require('./routes/schemes');
const advisoryRoutes = require('./routes/advisory');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173']
}));
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/advisory', advisoryRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
INNEREOF

cat << 'INNEREOF' > routes/health.js
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({
        status: "ok",
        service: "Nayak AI Backend",
        version: "0.1.0"
    });
});

module.exports = router;
INNEREOF

cat << 'INNEREOF' > routes/locations.js
const express = require('express');
const router = express.Router();

router.get('/search', (req, res) => {
    // Prototype sample data
    res.json({
        results: [
            {
                village: "Rampur",
                block: "Palampur",
                district: "Kangra",
                state: "Himachal Pradesh",
                latitude: 32.11,
                longitude: 76.53
            }
        ]
    });
});

module.exports = router;
INNEREOF

cat << 'INNEREOF' > routes/businesses.js
const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
    res.json([
        {
            id: "dairy",
            name: "Dairy Farming",
            description: "Milk production and local distribution.",
            typical_starting_cost: 500000,
            market_type: "Local",
            seasonality: "Year-round",
            risk_level: "Medium",
            sample_products: ["Milk", "Curd", "Ghee"]
        }
    ]);
});

module.exports = router;
INNEREOF

cat << 'INNEREOF' > services/financialService.js
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
INNEREOF

cat << 'INNEREOF' > services/schemeRouter.js
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
        } else {
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
        }
    }
}

module.exports = SchemeRouter;
INNEREOF

cat << 'INNEREOF' > services/aiService.js
class AIService {
    static generateAdvisory(location, category, margin) {
        return {
            feasibility: {
                level: "High (Illustrative / Prototype Estimate)",
                reasons: ["Consistent local demand", "Manageable starting cost"],
                suggested_next_steps: ["Survey local vendors", "Apply for loan"]
            },
            market_analysis: {
                estimated_local_customer_base: "500 households",
                suggested_service_radius: "5 km",
                distribution_channels: ["Direct to home", "Local retail shops"]
            },
            competitor_analysis: {
                competitor_density: "Low",
                competitor_types: ["Unorganized vendors"],
                competitive_observations: ["Scope for quality packaging"]
            },
            swot: {
                Strengths: ["Local sourcing"],
                Weaknesses: ["Initial capital"],
                Opportunities: ["Government schemes"],
                Threats: ["Seasonal fluctuations"]
            },
            risks: ["Supply bottlenecks", "Price fluctuations"]
        };
    }
}

module.exports = AIService;
INNEREOF

cat << 'INNEREOF' > routes/finance.js
const express = require('express');
const router = express.Router();
const FinancialService = require('../services/financialService');

router.post('/calculate', (req, res) => {
    const { available_margin } = req.body;
    if (!available_margin || available_margin <= 0) {
        return res.status(400).json({ error: "Invalid margin" });
    }
    const { projectCost, financingRequirement } = FinancialService.calculateProjectCost(available_margin);
    res.json({
        estimated_project_cost: projectCost,
        financing_requirement: financingRequirement
    });
});

router.post('/repayment', (req, res) => {
    const { loan_amount, interest_rate, tenure_years, frequency } = req.body;
    const schedule = FinancialService.calculateRepayment(loan_amount, interest_rate, tenure_years, frequency);
    res.json({
        loan_amount,
        interest_rate,
        tenure_years,
        frequency,
        schedule
    });
});

module.exports = router;
INNEREOF

cat << 'INNEREOF' > routes/schemes.js
const express = require('express');
const router = express.Router();
const SchemeRouter = require('../services/schemeRouter');

router.post('/recommend', (req, res) => {
    const { project_cost, available_margin } = req.body;
    const recommendation = SchemeRouter.recommend(project_cost, available_margin);
    res.json(recommendation);
});

module.exports = router;
INNEREOF

cat << 'INNEREOF' > routes/advisory.js
const express = require('express');
const router = express.Router();
const FinancialService = require('../services/financialService');
const SchemeRouter = require('../services/schemeRouter');
const AIService = require('../services/aiService');

router.post('/analyze', (req, res) => {
    const { location, available_margin, business_category } = req.body;
    
    if (!available_margin || available_margin <= 0) {
        return res.status(400).json({ error: "Invalid margin" });
    }

    const { projectCost, financingRequirement } = FinancialService.calculateProjectCost(available_margin);
    const scheme = SchemeRouter.recommend(projectCost, available_margin);
    const freq = scheme.scheme === "MICRO FINANCE SCHEME" ? "quarterly" : "monthly";
    const schedule = FinancialService.calculateRepayment(
        scheme.recommended_loan, scheme.interest_rate, scheme.tenure_years, freq
    );
    
    const aiInsights = AIService.generateAdvisory(location, business_category, available_margin);
    
    res.json({
        request_summary: { location, business_category, margin: available_margin },
        feasibility: aiInsights.feasibility,
        market_analysis: aiInsights.market_analysis,
        competitor_analysis: aiInsights.competitor_analysis,
        swot: aiInsights.swot,
        risks: aiInsights.risks,
        financial_plan: {
            available_margin,
            estimated_project_cost: projectCost,
            financing_requirement: financingRequirement
        },
        scheme_recommendation: scheme,
        repayment_plan: {
            loan_amount: scheme.recommended_loan,
            interest_rate: scheme.interest_rate,
            tenure_years: scheme.tenure_years,
            frequency: freq,
            schedule
        },
        recommendations: [`Apply for ${scheme.scheme}`, "Conduct detailed market survey"],
        disclaimer: "Prototype estimates only. Actual repayment terms are subject to the applicable channelizing agency / sanction terms."
    });
});

module.exports = router;
INNEREOF

cat << 'INNEREOF' > tests/endpoints.test.js
const request = require('supertest');
const app = require('../server');
const SchemeRouter = require('../services/schemeRouter');

describe('API Endpoints', () => {
    it('GET /api/health should return ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual("ok");
    });

    it('Scheme MFS logic works', () => {
        const res = SchemeRouter.recommend(100000, 10000);
        expect(res.scheme).toEqual("MICRO FINANCE SCHEME");
        expect(res.recommended_loan).toEqual(90000);
    });

    it('Scheme Term logic works', () => {
        const res = SchemeRouter.recommend(1000000, 100000);
        expect(res.scheme).toEqual("TERM LOAN SCHEME");
        expect(res.recommended_loan).toEqual(900000);
    });

    it('POST /api/advisory/analyze logic works', async () => {
        const res = await request(app)
            .post('/api/advisory/analyze')
            .send({
                location: {
                    village: "V",
                    block: "B",
                    district: "D",
                    state: "S"
                },
                available_margin: 100000,
                business_category: "dairy"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.financial_plan.estimated_project_cost).toEqual(1000000);
        expect(res.body.financial_plan.financing_requirement).toEqual(900000);
        expect(res.body.scheme_recommendation.scheme).toEqual("TERM LOAN SCHEME");
        expect(res.body.scheme_recommendation.recommended_loan).toEqual(900000);
    });
});
INNEREOF

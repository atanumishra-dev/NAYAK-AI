process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');
const SchemeRouter = require('../services/schemeRouter');

describe('API Endpoints & Scheme Routing Verification', () => {
    it('GET /api/health should return ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual("ok");
    });

    it('MANDATORY: 1,00,000 margin -> 10,00,000 project -> Term Loan', () => {
        const res = SchemeRouter.recommend(1000000, 100000);
        expect(res.scheme).toEqual("TERM LOAN SCHEME");
        expect(res.project_cost).toEqual(1000000);
        expect(res.calculated_financing).toEqual(900000);
        expect(res.recommended_loan).toEqual(900000);
        expect(res.interest_rate).toEqual(8.0);
        expect(res.tenure_years).toEqual(7);
        expect(res.moratorium_months).toEqual(6);
    });

    it('BOUNDARY: 1,40,000 project cost -> Micro Finance Scheme with ceiling', () => {
        const res = SchemeRouter.recommend(140000, 14000);
        expect(res.scheme).toEqual("MICRO FINANCE SCHEME");
        expect(res.recommended_loan).toEqual(125000); // Because of the ceiling
    });

    it('BOUNDARY: 1,40,001 project cost -> Term Loan', () => {
        const res = SchemeRouter.recommend(140001, 14000.1);
        expect(res.scheme).toEqual("TERM LOAN SCHEME");
    });

    it('BOUNDARY: 50,00,000 project cost -> Term Loan', () => {
        const res = SchemeRouter.recommend(5000000, 500000);
        expect(res.scheme).toEqual("TERM LOAN SCHEME");
        expect(res.recommended_loan).toEqual(4500000);
    });

    it('BOUNDARY: Above 50,00,000 project cost -> Not Eligible', () => {
        const res = SchemeRouter.recommend(5000001, 500000.1);
        expect(res.scheme).toContain("NOT ELIGIBLE");
    });

    it('POST /api/advisory/analyze logic works for mandatory case', async () => {
        const res = await request(app)
            .post('/api/advisory/analyze')
            .send({
                location: {
                    village: "Sample Rural",
                    block: "Sample Block",
                    district: "Sample District",
                    state: "Sample State"
                },
                available_margin: 100000,
                business_category: "Dairy"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.financial_plan.estimated_project_cost).toEqual(1000000);
        expect(res.body.financial_plan.financing_requirement).toEqual(900000);
        expect(res.body.scheme_recommendation.scheme).toEqual("TERM LOAN SCHEME");
        expect(res.body.scheme_recommendation.recommended_loan).toEqual(900000);
    });
});

import type { Express, Request, Response } from 'express';
import express from 'express';
import path from 'node:path';
import { TypeSafeClient } from '@typesafe-ai/sdk';
import dotenv from 'dotenv'

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const jev = new TypeSafeClient({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api',
});

const normalize = (rawAnswer: any) => {
    const {legend, probabilities} = rawAnswer
    const highest = Object.keys(probabilities).reduce((a,b) => probabilities[a] > probabilities[b] ? a : b)
    return legend[highest].split(' - ')[0]
}


app.post('/categorize', async (req: Request, res: Response) => {
    console.log(req.body)

    const { ticketText } = req.body
    if (!ticketText) {
        return res.status(400).json({ error: "Ticket content is required" });
    }

    const result = await jev.systemOne({
        model: 'jev-1.13',
        state: ticketText,
        questions: {
            department: {
                type: 'choice',
                instructions: 'Which team should own this ticket?',
                criteria: {
                    'Account Access & Security': 'Login problems, Two-factor / OTP not received, Device change or biometric setup, Suspected unauthorized access, Account freeze or unfreeze',
                    'Payments & Transfers': 'Failed or pending transfer, Wrong recipient or amount sent, Transfer limits, Bill payments, International / wire transfers, Scheduled and recurring payments',
                    'Cards': 'Lost or stolen card, Card activation or PIN issues, Card declined, Card replacement or delivery, Virtual card issues, Spending limits and controls',
                    'Fraud & Disputes': 'Unauthorized transaction, Merchant dispute or chargeback, Duplicate charge, Phishing or scam report, ATM dispute (cash not dispensed)',
                    'Transactions & Statements': 'Missing or incorrect transaction, Statement or tax document request, Pending vs posted transaction questions, Transaction history export',
                    'Loans & Credit': 'Loan application status, Repayment issues or due dates, Interest rate and fee questions, Credit limit change, Early payoff',
                    'Deposits & Savings': 'Check or mobile deposit issues, Direct deposit setup, Savings goals and interest, Fixed / term deposit questions',
                    'Account Management': 'Personal details update, KYC / identity verification, Account opening or closure, Joint account or authorized user changes, Notification preferences',
                    'Fees & Billing': 'Unexpected fee, Fee waiver request, Overdraft charges, Subscription or premium plan billing',
                    'App & Technical Issues': 'App crash or won\'t load, Bug or incorrect display, Update or compatibility problem, Slow performance, Feature not working as expected',
                    'General Inquiry': 'Product questions, How-to help',
                    'Feedback & Complaints': 'Feature requests, Service complaints',
                    'Other': 'Anything that does not fit another category, flagged for human review',
                },
            },
            urgency: {
                type: 'score',
                instructions: 'How urgent is this ticket?',
                criteria: [
                    'Critical - Money is actively at risk or the customer is fully locked out: confirmed fraud or unauthorized transactions, lost or stolen card, account compromised, funds missing, large transfer failed with an immediate deadline',
                    'High - Customer cannot complete an essential action and time matters: account locked, card declined while traveling, payment failed with a due date within 24-48 hours, loan repayment issue, KYC block on a needed service',
                    'Medium - Problem affects normal use but has a workaround and no immediate deadline: pending transfer, incorrect transaction, unexpected fee, deposit delay, feature not working as expected',
                    'Low - No time pressure or financial risk: statement requests, how-to questions, personal details update, feature requests, general feedback',
                ],
            },
        },
    });

    const { answers } = result
    const category = answers.department.choice
    const urgency = normalize(answers.urgency)

    res.send({ category, urgency })
})

app.get('/test', (req: Request, res: Response) => {
    res.send("App working??")
})

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});


app.listen(PORT);
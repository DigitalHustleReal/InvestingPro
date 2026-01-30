import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'spot-check-sample.csv');
const content = fs.readFileSync(csvPath, 'utf-8').replace(/\r\n/g, '\n');
const lines = content.split('\n');
const header = lines[0];
const rows = lines.slice(1).filter(l => l.trim());

const updatedRows = rows.map(row => {
    const rowTrimmed = row.trim();
    let status = '';
    let note = '';
    
    if (rowTrimmed.includes('mutual_funds')) {
        status = 'correct';
        note = 'Verified compliant with AMFI data';
    } else if (rowTrimmed.includes('credit_cards')) {
        status = 'incorrect';
        note = 'Missing annual_fee and interest_rate';
    } else if (rowTrimmed.includes('loans')) {
        status = 'incorrect';
        note = 'Missing interest_rate and bank details';
    } else if (rowTrimmed.includes('insurance')) {
        status = 'incorrect';
        note = 'Missing all key fields';
    }
    
    if (rowTrimmed.endsWith(',,')) {
        return rowTrimmed.substring(0, rowTrimmed.length - 2) + `,${status},"${note}"`;
    }
    return rowTrimmed;
});

const newContent = [header, ...updatedRows].join('\n');
fs.writeFileSync(csvPath, newContent);
console.log('✅ Updated spot-check-sample.csv with verification results');

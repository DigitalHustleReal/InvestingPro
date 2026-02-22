const fetch = require('node-fetch');

async function testPipeline() {
    console.log('🚀 Starting End-to-End Pipeline Test...');
    
    const payload = {
        count: 1,
        mode: 'keyword',
        seedKeyword: 'Personal Loan Interest Rates in India 2026',
        category: 'loans',
        authorId: '6db4cb4e-4363-4a6f-86b8-67c672d520e1',
        authorName: 'Aisha Khan'
    };

    try {
        const response = await fetch('http://localhost:3000/api/content-pipeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ Pipeline API error:', error);
            return;
        }

        console.log('📡 Connected to Pipeline Stream...');
        
        // Read the stream
        const body = response.body;
        body.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        console.log(`[${data.stage}] ${data.message}`);
                        
                        if (data.stage === 'result') {
                            console.log('\n✅ Pipeline Finished Successfully!');
                            console.log('Article Result:', JSON.stringify(data.data, null, 2));
                        }
                    } catch (e) {
                        // Not every line is valid JSON
                    }
                }
            }
        });

        body.on('error', (err) => {
            console.error('❌ Stream error:', err);
        });

    } catch (error) {
        console.error('❌ Failed to run test:', error);
    }
}

testPipeline();

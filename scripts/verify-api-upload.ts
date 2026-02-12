import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyApiUpload() {
    console.log('--- VERIFYING API UPLOAD ROUTE (Native Fetch) ---');

    const fileName = `verify-api-${Date.now()}.txt`;
    const filePath = `uploads/${fileName}`;
    const content = 'verify content from api using native fetch';
    
    const formData = new FormData();
    // In Node 20+, we can use Blob for files in FormData
    const blob = new Blob([content], { type: 'text/plain' });
    formData.append('file', blob, fileName);
    formData.append('filePath', filePath);
    formData.append('mimeType', 'text/plain');

    console.log(`Sending request to http://localhost:3000/api/media/upload...`);

    try {
        const response = await fetch('http://localhost:3011/api/media/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            console.log('API Upload SUCCESSFUL!');
            console.log('Result:', JSON.stringify(result, null, 2));
        } else {
            console.error('API Upload FAILED:', result.error || response.statusText);
            console.log('Full response:', result);
        }
    } catch (error: any) {
        console.error('Fetch error:', error.message);
        console.log('Is the dev server running on localhost:3011? (Metadata says 3000, checking...)');
        
        // Retry with 3000 if 3011 fails (sometimes port shifts in environments)
        try {
            const response3000 = await fetch('http://localhost:3000/api/media/upload', {
                method: 'POST',
                body: formData
            });
            const result3000 = await response3000.json();
            if (response3000.ok) {
                console.log('API Upload SUCCESSFUL on port 3000!');
                console.log('Result:', JSON.stringify(result3000, null, 2));
            } else {
                console.error('API Upload FAILED on port 3000:', result3000.error);
            }
        } catch (e: any) {
            console.error('Both 3011 and 3000 failed. Error:', e.message);
        }
    }

    console.log('\n--- VERIFICATION COMPLETE ---');
}

verifyApiUpload().catch(console.error);

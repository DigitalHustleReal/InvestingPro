const result = 'Sure! Here is the JSON: ```json\n{\n  "test": 1\n}\n```';
const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || 
                 result.match(/```\s*([\s\S]*?)\s*```/) ||
                 result.match(/(\{[\s\S]*\})/);

if (jsonMatch) {
    const jsonContent = (jsonMatch[1] || jsonMatch[0]).trim();
    console.log('EXTRACTED:', jsonContent);
    try {
        JSON.parse(jsonContent);
        console.log('✅ VALID JSON');
    } catch (e) {
        console.log('❌ INVALID JSON:', e.message);
    }
} else {
    console.log('❌ NO MATCH');
}

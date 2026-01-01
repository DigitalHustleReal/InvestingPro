/**
 * Test Script: Generate Sample Images
 * 
 * Tests the AI image generation system with sample prompts
 * Verifies DALL-E 3 integration works correctly
 */

import { generateFeaturedImage, generateArticleIllustration } from '../lib/ai/image-generator'

async function testImageGeneration() {
  console.log('🎨 Testing AI Image Generation System\n')
  
  // Test 1: Featured Image for Credit Cards
  console.log('📸 Test 1: Generating featured image for credit cards...')
  try {
    const creditCardImage = await generateFeaturedImage(
      'Best Credit Cards in India 2025',
      'credit_cards'
    )
    
    if (creditCardImage) {
      console.log('✅ SUCCESS! Featured image URL:', creditCardImage)
      console.log('📋 Copy this URL and paste in browser to view\n')
    } else {
      console.log('❌ Failed to generate credit card image\n')
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message, '\n')
  }
  
  // Test 2: Chart Illustration
  console.log('📊 Test 2: Generating chart illustration...')
  try {
    const chartImage = await generateArticleIllustration(
      'SIP investment growth over 10 years',
      'chart'
    )
    
    if (chartImage) {
      console.log('✅ SUCCESS! Chart image URL:', chartImage)
      console.log('📋 Copy this URL and paste in browser to view\n')
    } else {
      console.log('❌ Failed to generate chart\n')
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message, '\n')
  }
  
  // Test 3: Infographic
  console.log('🎯 Test 3: Generating infographic...')
  try {
    const infographic = await generateArticleIllustration(
      'How mutual fund SIP works - investment flow process',
      'infographic'
    )
    
    if (infographic) {
      console.log('✅ SUCCESS! Infographic URL:', infographic)
      console.log('📋 Copy this URL and paste in browser to view\n')
    } else {
      console.log('❌ Failed to generate infographic\n')
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message, '\n')
  }
  
  console.log('✅ Image generation tests complete!')
  console.log('\n💡 Note: Images are temporary DALL-E URLs')
  console.log('💡 They expire after ~1 hour')
  console.log('💡 In production, we save them to Supabase Storage\n')
}

// Run tests
testImageGeneration()
  .then(() => {
    console.log('✅ All tests finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Test failed:', error)
    process.exit(1)
  })

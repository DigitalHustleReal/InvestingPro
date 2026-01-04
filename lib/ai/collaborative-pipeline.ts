import { authorAI } from './author-ai';
import { editorAI } from './editor-ai';

/**
 * Collaborative Content Pipeline
 * Combines Author + Editor AI for high-quality content generation
 */
export class ContentPipeline {
    
    /**
     * Generate glossary term with author-editor collaboration
     */
    async generateGlossaryTerm(
        term: string,
        category: string,
        maxRevisions: number = 2
    ): Promise<{
        finalContent: any;
        authorDrafts: any[];
        editorReviews: any[];
        revisionCount: number;
        qualityScore: number;
        approved: boolean;
    }> {
        console.log(`\n📝 Starting glossary generation: "${term}"`);
        
        const authorDrafts = [];
        const editorReviews = [];
        let currentDraft;
        let revisionCount = 0;
        
        // Step 1: Author creates initial draft
        console.log('   Author: Writing initial draft...');
        currentDraft = await authorAI.writeGlossaryTerm(term, category);
        authorDrafts.push({ version: 1, content: currentDraft });
        
        // Step 2: Editor reviews
        console.log('   Editor: Reviewing draft...');
        let editorFeedback = await editorAI.reviewGlossaryTerm(currentDraft);
        editorReviews.push({ version: 1, feedback: editorFeedback });
        
        // Step 3: Revision loop if needed
        while (
            editorFeedback.status === 'needs_revision' && 
            revisionCount < maxRevisions &&
            (editorFeedback.criticalIssues.length > 0 || editorFeedback.majorImprovements.length > 0)
        ) {
            revisionCount++;
            console.log(`   Author: Revising (attempt ${revisionCount})...`);
            
            // Use editor's improved version as next draft
            currentDraft = editorFeedback.editedVersion;
            authorDrafts.push({ version: revisionCount + 1, content: currentDraft });
            
            // Editor re-reviews
            console.log('   Editor: Re-reviewing...');
            editorFeedback = await editorAI.reviewGlossaryTerm(currentDraft);
            editorReviews.push({ version: revisionCount + 1, feedback: editorFeedback });
        }
        
        // Final content is editor's polished version
        const finalContent = editorFeedback.editedVersion;
        const approved = editorFeedback.status === 'approved';
        
        // Calculate quality score
        const qualityScore = this.calculateQualityScore(editorFeedback);
        
        console.log(`   ✅ Complete! Revisions: ${revisionCount}, Score: ${qualityScore}/100`);
        
        return {
            finalContent,
            authorDrafts,
            editorReviews,
            revisionCount,
            qualityScore,
            approved
        };
    }

    /**
     * Calculate quality score from editor feedback
     */
    private calculateQualityScore(editorFeedback: any): number {
        let score = 100;
        
        // Deduct for issues
        score -= editorFeedback.criticalIssues.length * 20;
        score -= editorFeedback.majorImprovements.length * 10;
        score -= editorFeedback.minorSuggestions.length * 3;
        
        // Floor at 0
        return Math.max(0, score);
    }
}

// Singleton export
export const contentPipeline = new ContentPipeline();

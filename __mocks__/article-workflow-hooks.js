
const { createClient } = require('./@supabase/supabase-js');
const supabase = createClient();

module.exports = {
  transitionArticleState: async (id, from, to, action) => {
    console.log(`MockWorkflow: Transitioning ${id} to ${to}`);
    // Update the mock database directly
    const { error } = await supabase.from('articles').update({ status: to }).eq('id', id);
    if (error) console.error('MockWorkflow: Update failed', error);
    return true;
  },
  triggerArticlePublishingWorkflow: async () => 'mock-workflow-id'
};

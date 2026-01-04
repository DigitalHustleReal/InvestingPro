-- RPC to increment completed items count safely
CREATE OR REPLACE FUNCTION increment_batch_progress(batch_row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE content_batches
  SET completed_items = completed_items + 1,
      updated_at = NOW()
  WHERE id = batch_row_id;
END;
$$ LANGUAGE plpgsql;

-- RPC to increment click counter
CREATE OR REPLACE FUNCTION increment_affiliate_click(link_row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE affiliate_links
  SET clicks = clicks + 1,
      last_clicked_at = NOW()
  WHERE id = link_row_id;
END;
$$ LANGUAGE plpgsql;

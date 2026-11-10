CREATE TABLE IF NOT EXISTS enterprise_leads (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  ip_hash TEXT,
  notification_state TEXT NOT NULL DEFAULT 'queued',
  notification_attempts INTEGER NOT NULL DEFAULT 0,
  notification_next_at INTEGER NOT NULL DEFAULT 0,
  notification_lease_until INTEGER NOT NULL DEFAULT 0,
  notification_error TEXT
);
CREATE INDEX IF NOT EXISTS enterprise_leads_ip_time ON enterprise_leads(ip_hash, created_at);
CREATE INDEX IF NOT EXISTS enterprise_leads_email_time ON enterprise_leads(email, created_at);
CREATE INDEX IF NOT EXISTS enterprise_leads_notify ON enterprise_leads(notification_state, notification_next_at);

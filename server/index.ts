import cors from 'cors';
import express from 'express';
import { createSession, getSession, type SessionDemographics } from './db';

const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors());
app.use(express.json());

function isValidDemographics(body: unknown): body is SessionDemographics {
  if (!body || typeof body !== 'object') return false;
  const d = body as Record<string, unknown>;
  const fieldKeys = ['profession', 'location', 'nativeLanguage', 'focus', 'goal'] as const;
  for (const key of fieldKeys) {
    const val = d[key];
    if (!val || typeof val !== 'object') return false;
    const f = val as Record<string, unknown>;
    if (typeof f.presetId !== 'string' || typeof f.manual !== 'boolean' || typeof f.customText !== 'string') {
      return false;
    }
  }
  return typeof d.hometown === 'string' && d.hometown.trim().length > 0;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/sessions', (req, res) => {
  if (!isValidDemographics(req.body)) {
    res.status(400).json({ error: 'Invalid demographics payload' });
    return;
  }

  try {
    const session = createSession(req.body);
    res.status(201).json(session);
  } catch (err) {
    console.error('Failed to create session:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/sessions/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json(session);
});

app.listen(PORT, () => {
  console.log(`DialaGO session API listening on http://localhost:${PORT}`);
});

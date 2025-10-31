import mongoose, { Schema, Document, Model } from 'mongoose';

// Event document interface with strict typing
export interface EventDoc extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO (YYYY-MM-DD)
  time: string; // 24h (HH:mm)
  mode: string; // online | offline | hybrid
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Minimal, dependency-free slug generator
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/["'`]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Normalize to ISO date (YYYY-MM-DD); throws for invalid inputs
function normalizeDateISO(input: string): string {
  const s = input.trim();
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  if (isoDate.test(s)) return s; // already ISO date-only
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date');
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Normalize time to 24h HH:mm; supports 24h or 12h with AM/PM
function normalizeTime(input: string): string {
  const s = input.trim();
  const m24 = s.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m24) {
    const h = String(parseInt(m24[1], 10)).padStart(2, '0');
    const mm = m24[2];
    return `${h}:${mm}`;
  }
  const m12 = s.match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const mm = m12[2];
    const mer = m12[3].toUpperCase();
    if (h < 1 || h > 12) throw new Error('Invalid time');
    if (mer === 'AM') {
      h = h % 12;
    } else {
      h = h % 12 + 12;
    }
    return `${String(h).padStart(2, '0')}:${mm}`;
  }
  // Last resort parse; may reject non-standard inputs
  const d = new Date(`1970-01-01T${s}`);
  if (!Number.isNaN(d.getTime())) {
    const h = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${mm}`;
  }
  throw new Error('Invalid time');
}

const EventSchema = new Schema<EventDoc>(
  {
    title: { type: String, required: [true, 'title is required'], trim: true },
    slug: { type: String, unique: true, index: true }, // unique index for SEO-friendly URLs
    description: { type: String, required: [true, 'description is required'], trim: true },
    overview: { type: String, required: [true, 'overview is required'], trim: true },
    image: { type: String, required: [true, 'image is required'], trim: true },
    venue: { type: String, required: [true, 'venue is required'], trim: true },
    location: { type: String, required: [true, 'location is required'], trim: true },
    date: { type: String, required: [true, 'date is required'], trim: true }, // normalized to YYYY-MM-DD
    time: { type: String, required: [true, 'time is required'], trim: true }, // normalized to HH:mm
    mode: { type: String, required: [true, 'mode is required'], trim: true },
    audience: { type: String, required: [true, 'audience is required'], trim: true },
    agenda: {
      type: [String],
      required: [true, 'agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'agenda must be a non-empty array',
      },
    },
    organizer: { type: String, required: [true, 'organizer is required'], trim: true },
    tags: {
      type: [String],
      required: [true, 'tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'tags must be a non-empty array',
      },
    },
  },
  { timestamps: true, strict: true }
);

// Ensure unique slug for fast lookups and routing
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save: slug generation, date/time normalization, and basic validation
EventSchema.pre('save', function (next) {
  try {
    // Regenerate slug only if title changed
    if (this.isModified('title')) {
      if (!this.title || !this.title.trim()) throw new Error('title is required');
      this.slug = slugify(this.title);
    }

    // Normalize and validate date and time formats consistently
    if (this.isModified('date')) {
      this.date = normalizeDateISO(this.date);
    }
    if (this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }

    // Trim and normalize string arrays
    if (this.isModified('agenda') && Array.isArray(this.agenda)) {
      this.agenda = this.agenda.map((s) => s.trim()).filter(Boolean);
    }
    if (this.isModified('tags') && Array.isArray(this.tags)) {
      this.tags = this.tags.map((s) => s.trim()).filter(Boolean);
    }

    // Final required string guards to ensure non-empty values
    const doc = this as EventDoc;
    const assertStr = (name: string, val: string) => {
      if (typeof val !== 'string' || !val.trim()) throw new Error(`${name} is required`);
    };
    assertStr('title', doc.title);
    assertStr('description', doc.description);
    assertStr('overview', doc.overview);
    assertStr('image', doc.image);
    assertStr('venue', doc.venue);
    assertStr('location', doc.location);
    assertStr('date', doc.date);
    assertStr('time', doc.time);
    assertStr('mode', doc.mode);
    assertStr('audience', doc.audience);
    assertStr('organizer', doc.organizer);

    if (!Array.isArray(doc.agenda) || doc.agenda.length === 0) throw new Error('agenda is required');
    if (!Array.isArray(doc.tags) || doc.tags.length === 0) throw new Error('tags are required');

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Event: Model<EventDoc> =
  (mongoose.models.Event as Model<EventDoc>) || mongoose.model<EventDoc>('Event', EventSchema);

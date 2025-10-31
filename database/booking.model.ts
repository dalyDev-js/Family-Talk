import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

// Booking document interface with strict typing
export interface BookingDoc extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

function isValidEmail(email: string): boolean {
  // Pragmatic RFC5322-ish regex (simple and effective for most cases)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const BookingSchema = new Schema<BookingDoc>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'eventId is required'],
      index: true, // frequent filter target
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => isValidEmail(v),
        message: 'Invalid email format',
      },
    },
  },
  { timestamps: true, strict: true }
);

// Additional index for faster event-based queries
BookingSchema.index({ eventId: 1 });

// Pre-save: ensure referenced event exists and email is valid
BookingSchema.pre('save', async function (next) {
  try {
    if (!isValidEmail(this.email)) throw new Error('Invalid email format');

    if (this.isNew || this.isModified('eventId')) {
      const exists = await Event.exists({ _id: this.eventId });
      if (!exists) throw new Error('Referenced event does not exist');
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Booking: Model<BookingDoc> =
  (mongoose.models.Booking as Model<BookingDoc>) || mongoose.model<BookingDoc>('Booking', BookingSchema);

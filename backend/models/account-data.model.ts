import mongoose, { Schema, model, Types } from 'mongoose';

/**
 * Tracks player balances and streak progress.
 */
export interface AccountData {
  currentUser: Types.ObjectId;
  currentBalance: number;
  cosmeticCurrency: number;
  currentDailyStreakCount: number;
  longestStreakCount: number;
}

const accountDataSchema = new Schema<AccountData>(
  {
    currentUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    currentBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    cosmeticCurrency: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    currentDailyStreakCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    longestStreakCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const AccountDataModel =
  mongoose.models.AccountData ??
  model<AccountData>('AccountData', accountDataSchema);

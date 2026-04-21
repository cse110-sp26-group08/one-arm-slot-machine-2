import mongoose, { Schema, model, Types } from 'mongoose';

/**
 * Records the outcome of each slot machine run.
 */
export interface Game {
  player: Types.ObjectId;
  amountWagered: number;
  amountWonLost: number;
}

const gameSchema = new Schema<Game>(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amountWagered: {
      type: Number,
      required: true,
      min: 0
    },
    amountWonLost: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const GameModel =
  mongoose.models.Game ?? model<Game>('Game', gameSchema);

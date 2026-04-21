import mongoose, { Schema, model, Types } from 'mongoose';

/**
 * Maintains each player's friend list.
 */
export interface Friends {
  currentUser: Types.ObjectId;
  friends: Types.ObjectId[];
}

const friendsSchema = new Schema<Friends>(
  {
    currentUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    friends: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const FriendsModel =
  mongoose.models.Friends ?? model<Friends>('Friends', friendsSchema);

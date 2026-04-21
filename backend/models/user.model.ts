import bcrypt from 'bcryptjs';
import mongoose, { Schema, model } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

const PASSWORD_SALT_ROUNDS = 10;

/**
 * Slot machine user account stored in MongoDB.
 */
export interface User {
  name: string;
  displayName: string;
  dateOfBirth: Date;
  email: string;
  passwordHash: string;
}

/**
 * User document instance helpers.
 */
export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User model helpers.
 */
export interface UserModel extends Model<User, object, UserMethods> {
  hashPassword(plainTextPassword: string): Promise<string>;
}

type UserDocument = HydratedDocument<User, UserMethods>;

const userSchema = new Schema<User, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 60
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/**
 * Hashes an incoming password for storage.
 *
 * @param {string} plainTextPassword - Password supplied by the user.
 * @returns {Promise<string>} Secure bcrypt hash.
 */
userSchema.static(
  'hashPassword',
  async function hashPassword(plainTextPassword: string) {
    return bcrypt.hash(plainTextPassword, PASSWORD_SALT_ROUNDS);
  }
);

/**
 * Compares a raw password against the persisted bcrypt hash.
 *
 * @param {string} candidatePassword - User supplied password input.
 * @returns {Promise<boolean>} Comparison result.
 */
userSchema.method(
  'comparePassword',
  async function comparePassword(
    this: UserDocument,
    candidatePassword: string
  ) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
  }
);

/**
 * Virtual write-only password helper so callers never persist plain text.
 */
userSchema
  .virtual('password')
  .set(function setPassword(this: UserDocument, plainTextPassword: string) {
    this.passwordHash = bcrypt.hashSync(plainTextPassword, PASSWORD_SALT_ROUNDS);
  });

export const UserModel =
  (mongoose.models.User as UserModel | undefined) ??
  model<User, UserModel>('User', userSchema);

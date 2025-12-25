import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  avatar?: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes (email already has unique index from @Prop decorator)
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });


import mongoose from 'mongoose'

const { Schema } = mongoose
const UserSchema = new Schema({
  hashedValue: {
    type: String,
    required: true,
    unique: true,
  },
  jwtToken: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
  },
  date: { type: Date, default: Date.now },
})

export default mongoose.model('User', UserSchema)

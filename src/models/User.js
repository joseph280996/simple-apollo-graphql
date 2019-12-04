import mongoose from 'mongoose'

// TODO: store email, store code instead of hashedValue

const { Schema } = mongoose
const UserSchema = new Schema({
  hashedValue: {
    type: String,
    required: true,
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

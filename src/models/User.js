import mongoose from 'mongoose'
import validator from 'validator'

const { Schema } = mongoose
const UserSchema = new Schema({
  name: {
    type:String,
    default: 'Anonymous',
  },
  email: {
    type:String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)){
        throw new Error ('Invalid Email');
      }
    }
  },
  password: {
    type:String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value){
      if(value.includes('password')) {
        throw new Error('Password cannot includes "password"');
      }
    }
  },
  date: { type: Date, default: Date.now },
})



export default mongoose.model('User', UserSchema)

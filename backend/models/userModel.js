import mongoose from 'mongoose';
import  bcrypt  from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: [true, 'first name is required'],
        maxlength: 32,
    },

    email: {
        type: String,
        trim: true,
        required: [true, 'e-mail is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is required'],
        minlength: [6, 'password must have at least (6) caracters'],
    },

    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}


export const User = mongoose.model('User', userSchema);
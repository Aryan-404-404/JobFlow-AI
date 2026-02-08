import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add name"],
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
        trim: true,
    },
    password: {
        type: String,
        required: function (){
            return !this.googleId               //It doesn't asks for password while signing in using OAuth google
        },
        minlength: [6, "password must be longer"],
        select: false,                          //prevents passwords while fetching the user from DB
    },
    resumeText: {
        type: String,
        default: ""
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
    // sparse: true --> If 2 users login via email (not OAuth) then googleId sets to null which can cause error (unique: true) 
    // there sparse says only if googleId isn't null then check for error
}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)
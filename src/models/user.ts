import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
const salt = 10;

const userSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

/*
 * Event Hooks
*/

userSchema.pre('save', function (next) {
    // pre save logic here
});

/*
 * Methods
 */

 /**
  * Compares a supplied password against the User's password to see if they match.
  *
  * @param password the password to check
  *
  * @return {Promise<boolean>} a Promise that resolves with the comparison result or rejects an Error
  */
 userSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compare(password, this.password);
 };

export default model('User', userSchema);
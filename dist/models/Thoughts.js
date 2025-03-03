import { Schema, model } from 'mongoose';
import reactionSchema from './Reactions.js';
const thoughtsSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true,
    },
    // Use the imported reaction schema directly
    reactions: [reactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});
thoughtsSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});
// Helper function to format date
function formatDate(timestamp) {
    return timestamp.toLocaleString();
}
const Thoughts = model('Thought', thoughtsSchema);
export default Thoughts;

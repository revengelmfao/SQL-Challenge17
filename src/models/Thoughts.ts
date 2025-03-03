import { Schema, Types, Document, model } from 'mongoose';
import reactionSchema from './Reactions.js';

// Update interface to reflect embedded documents
interface IThoughts extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: Array<{
        reactionId?: Types.ObjectId;
        reactionBody: string;
        username: string;
        createdAt?: Date;
    }>;
}

const thoughtsSchema = new Schema<IThoughts>(
    {
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
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

thoughtsSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Helper function to format date
function formatDate(timestamp: Date): string {
    return timestamp.toLocaleString();
}

const Thoughts = model('Thought', thoughtsSchema);

export default Thoughts;

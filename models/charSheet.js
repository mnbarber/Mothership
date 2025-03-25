const mongoose = require('mongoose');

const charSheetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        pronouns: {
            type: String
        },
        class: {
            type: String,
            required: true,
            enum: ['Marine', 'Android', 'Scientist', 'Teamster']
        },
        stats: {
            strength: {
                type: Number,
                required: true
            },
            speed: {
                type: Number,
                required: true
            },
            intellect: {
                type: Number,
                required: true
            },
            combat: {
                type: Number,
                required: true
            }
        },
        saves: {
            sanity: {
                type: Number,
                required: true
            },
            fear: {
                type: Number,
                required: true
            },
            body: {
                type: Number,
                required: true
            }
        },
        health: {
            current: {
                type: Number,
                required: true
            },
            maximum: {
                type: Number,
                required: true
            }
        },
        wounds: {
            current: {
                type: Number,
                required: true
            },
            maximum: {
                type: Number,
                required: true
            }
        },
        stress: {
            current: {
                type: Number,
                required: true
            },
            maximum: {
                type: Number,
                required: true
            }
        },
        equipment: {
            type: String
        },
        skills: {
            type: String
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
);

const CharSheet = mongoose.model('CharSheet', charSheetSchema);

module.exports = CharSheet;
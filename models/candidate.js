const mongoose = require('mongoose');

const {MAX_OPINION, MAX_COMMENT} = require('../constants/restrictions');
const REGEX = require('../constants/regex');
const {toClient} = require('../utils/schema');

const {Schema} = mongoose;

function feedbackArrayLengthValidator(value) {
    return (value.length && value.length >= 0 && value.length < MAX_OPINION);
}

const FeedbackSchema = new Schema({
    liked: {
        type: [Schema.Types.ObjectId],
        default: [],
        allowBlank: true,
        validate: {
            validator: feedbackArrayLengthValidator,
            message: 'feedback.liked length exceeded',
        },
    },
    disliked: {
        type: [Schema.Types.ObjectId],
        default: [],
        allowBlank: true,
        validate: {
            validator: feedbackArrayLengthValidator,
            message: 'feedback.disliked length exceeded',
        },
    },
    comment: {
        type: [Schema.Types.ObjectId],
        default: '',
        allowBlank: true,
        trim: true,
        maxlength: [MAX_COMMENT, 'feedback.comment length exceeded'],
    },
}, {
    collection: 'feedbacks',
});

FeedbackSchema.method('toClient', toClient);

const ResultSchema = new Schema({
    link: {
        type: String,
        trim: true,
        match: REGEX.URL,
    },
    answers: {
        type: Object,
        default: {},
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
}, {
    collection: 'results',
});

ResultSchema.method('toClient', toClient);

const CandidateSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    skype: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        match: REGEX.EMAIL,
    },
    result: ResultSchema,
    feedback: FeedbackSchema,
}, {
    collection: 'candidates',
});

CandidateSchema.method('toClient', toClient);

exports.CandidateSchema = CandidateSchema;
exports.ResultSchema = ResultSchema;
exports.FeedbackSchema = FeedbackSchema;

exports.CandidateModel = mongoose.model('Candidate', CandidateSchema);

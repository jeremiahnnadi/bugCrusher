const { Schema, model} = require('mongoose');
const { nanoid } = require('nanoid')

const TicketSchema = new Schema(
        {
            _id: {
                type: String,
                default: () => nanoid(12)
            },
            title: {
                type: String,
                trim: true
            },
            user: {
                type: Schema.Types.ObjectId, 
                ref: 'User'
            },
            ticketType: {
                type: String,
                enum: ['Development', 'Testing', 'Production']
            },
            ticketStatus: {
                type: String,
                enum: ['Open', 'Resolved' , 'Closed'],
                default: 'Open'
            },
            ticketPriority: {
                type: String,
                enum: ['Low', 'Medium', 'High']
            }, 
            assignedTo: {
                type: String,
                enum: ['Jeremiah Nnadi', 'Mwara Nyoike', 'Madani Napaul', 'Julian Mason', 'Okemdi Udeh', 'Yassine Lahkmarti']
            },
            createdBy: {
                type: String
            },
            description: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now 
            }
        }, {timestamps: true});

module.exports = model('Ticket', TicketSchema);
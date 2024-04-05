const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      type: {
        type: String,
        required: true
      },
      scheduled_time: {
        type: Date,
        required: true
      },
      parameters: {
        type: Object,
        default: {}
      },
      status: {
        type: String,
        enum: ['pending', 'running', 'failed', 'successful'],
        default: 'pending'
      },
      created_at: {
        type: Date,
        default: Date.now
      },
      logs: {
        type: [String],
        default: []
      },
      attempts: {
        type: Number,
        default: 0
      },
      max_attempts: {
        type: Number,
        default: 2
      },
      isRecurring: {
          type: Boolean,
          default: false
      },
      cron_expression: {
          type: String 
      }
})

module.exports = mongoose.model('Job', jobSchema)
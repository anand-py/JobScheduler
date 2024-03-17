const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type : {
        type : String,
        required : true
    },
    status :{
        type : String,
        required : true,
        default : 'pending'
    },
    scheduleTime :{
        
    }
})

module.exports = mongoose.model('Job', jobSchema)
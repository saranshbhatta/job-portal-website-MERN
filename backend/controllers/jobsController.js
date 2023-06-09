const Job = require('../models/jobModels');
const JobType = require('../models/jobTypeModel');
const ErrorResponse = require('../utils/errorResponse');

//create job
exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create({
            title: req.body.title,
            description: req.body.description,
            salary: req.body.salary,
            location: req.body.location,
            jobType: req.body.jobType,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//single job
exports.singleJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//update job by id.
exports.updateJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, { new: true }).populate('jobType', 'jobTypeName').populate('user', 'firstName lastName');
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//update job by id.
exports.showJobs = async (req, res, next) => {

    //enable search
    const keyword = req.query.keyword ? {
        title:{
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}


    

   //enable pagination
   const pageSize = 5;
   const page = Number(req.query.pageNumber) || 1;
//    const count = await Job.find({}).estimatedDocumentCount();
   const count = await Job.find({...keyword }).countDocuments();

    try {
        const jobs = await Job.find({...keyword }).populate('jobType', 'jobTypeName').populate('user', 'firstName').sort({createdAt: -1}).skip(pageSize * (page - 1)).limit(pageSize)
        res.status(200).json({
            success: true,
            jobs,
            page,
            pages:Math.ceil(count / pageSize),
            count
        })
    } catch (error) {
        next(error);
    }
}



//delete job
exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Job deleted"
        })
        next();

    } catch (error) {
        return next(error);
    }
}


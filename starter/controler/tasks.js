// const { Long } = require("mongodb");
// const Task = require(`../models/Tasks`);

// const asyncWrapper = require(`../middleware/async`);
// const { createCustomError } = require(`../errors/custom-errors`)

// //  you can get a task by .find() method, if no argument is passed in the find() method then it gives all the tasks that are present in the dataBase
// const getAllTasks = asyncWrapper (async (req, res) => {
//         const task = await Task.find({});   // gives all the tasks that are present in the dataBase
//         res.status(201).json({task});
//     }
// )

// //  because createTask is one of the method you can update your dataBase, thus i need to model.create here as well
// //  for that i need to make it async await
// const createTasks = asyncWrapper(async (req, res) => {
//     //  this creates an error in case of validation because of no try catch block
//         const task = await Task.create(req.body);
//         res.status(201).json( {task} );
//     }
// )


// //  to find one specific task having specific property mentioned in the params, then we use .findOne()
// const getTasks = asyncWrapper(async (req, res, next) => {
//         const {id: taskID} = req.params;
//         const task = await Task.findOne({_id: taskID});
        
//         //  if no such id existed
//         if(!task) {
//             return next(createCustomError(`No task with ID: ${taskID}`), 404);
//             // return res.status(404).json({msg: `No task with ID: ${taskID}`});
//         }

//         res.status(201).json({task});
//     }
// )

// const updateTasks = asyncWrapper(async (req, res, next) => {
//         const {id:taskID} = req.params;
//         const task = await Task.findOneAndUpdate({_id:taskID}, req.body, {
//             new: true,  //  If not this, then you wil get same old value ever after updation
//             runValidators: true, //  the validations we set for Schema work only for the post method, so update can lead to missing values, thus we neet to runValidations
//         });

//         if(!task) {
//             return next(createCustomError(`No task with ID: ${taskID}`), 404);
//             // const error = new Error(`Not Found`);
//             // error.status = 404;
//             // return next(error);
//             // return res.status(404).json({msg: `No task with ID: ${taskID}`});
//         }

//         res.status(200).json({task});
//     }
// )


// //  delete task can be done using findOneAndDelete
// const deleteTasks = asyncWrapper(async (req, res, next) => {

//         const {id: taskID} = req.params;
//         const task = await Task.findOneAndDelete({_id: taskID});

//         //  No task found
//         if(!task) {
//             return next(createCustomError(`No task with ID: ${taskID}`), 404);
//         }

//         return res.status(201).json({task});
//     }
// )

// module.exports = {
//     getAllTasks,
//     createTasks,
//     getTasks,
//     updateTasks,
//     deleteTasks,
// };


const Task= require('../models/Tasks');
const asyncWrapper=require('../middleware/async');
const {createCustomError} = require('../errors/custom-errors');
const express = require(`express`);
const app = express();
const bodyParser = require('body-parser');

app.use(express.json);
app.use(bodyParser.json);

// to avoid all the repeated try-catches we make extra middleware to handle the error-handling try catches
// for once I am only doing it for the getAllTasks, can repeated for all of them

const getAllTasks = asyncWrapper( async(req,res)=>{
        const tasks = await Task.find({});//passing blank in .find returns all the items
        // multiple ways to respond 
        res.status(200).json({tasks});
        // res.status(200).json({tasks:tasks,amount : tasks.length});
        // res.status(200).json({status:"success",data:{tasks, nbHits : tasks.length}})
        // using data field is not recommneded with context to my frontend as in my javascript already I have sent it using data field (axios) , see that for more context
})

// if user gives it blank or enters something invalid, a big error comes and the process stops, so a good idea would be to handle it correctly in the try catch block
const createTask =async(req,res)=>{
    try {
        const task = await Task.create(req.body);
        res.status(201).json({task});// 201== successful POST request
    } catch (error) {
        res.status(500).json({msg : error});// 500 == some invalid or unexpected condition failure
    }//error.message object contains the secons string that we passed in the validation handling
}

// here we have handled two type of errors
// 1 is that given id not found or error 404 : In these errors the syntax of the input id is correct, i.e. the length of the id that mongoose is lokking for, is same, but that id doesn't get found
//2 But in this type of error, mongoose is unable to find the right syntax, that is number of characters is different in the thing reqd. by mongoose and the value input -> also called 'cast error'

//now the thing is that the errorHandler middleware to handle the !task 404 error also
const getTask =async(req,res)=>{
    try {
        const {id:taskID} = req.params;// same as const taskID = req.params.id
        const task =await Task.findOne({_id : taskID});
        if(!task){
            // creating a built-in error object to pass err to middleware
            const error = new Error('Not found');// i.e. error.message attribute is set to'Not Found'
            error.status=404;//error.status attribute status 404

            // the above can to be avoided and shortened using a customError handler that handles it
            return next(createCustomError(`No task with id : ${taskID}`,404));
            return next(error);
            /*return res.status(404).json({msg:`No task with id : ${taskID}`});// Error 404 : NOT FOUND!!*/
        }
        res.status(200).json({task : task});
    } catch (error) {
        res.status(500).json({msg : error});
    }
}

const deleteTask=async(req,res)=>{
    try {
        const {id:taskID}=req.params;
        const task = await Task.findOneAndDelete({_id:taskID});
        if(!task){
            res.status(404).json({msg:`No task with id : ${taskID}`});
        }
        res.status(200).json({task : task});
        // different type of return values and status depending upon usage
        // res.status(200).send();
        // res.status(200).json({task : null , status : "success"});
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
}

// issue for now is that there is no validation on the data we provide in req.body now, so all the previous validators have to be run
// also when we do res.status(200).json({task : task}), for now the task is the old one that was previously existing and not the updated one that is entered now, so that has to be handled too
// for handling the above two issues a third argument is passed in the findOneandUpdate
const updateTask =async(req,res)=>{
    try {
        const { id: taskID } = req.params;
        console.log('Received Data:', req.body);
        const task = await Task.findOneAndUpdate({ _id: taskID},req.body,{
            new:true,//return that new item
            runValidators:true//all the previous mentioned validators to operate
        });
        console.log(task);
        console.log(req.body);
        // console.log(req);
        if(!task){
            res.status(404).json({msg:`No task with id : ${taskID}`});
        }

        res.status(200).json({task});
    } catch (error) {
        res.status(500).json({msg:"hello"});
    }
}

module.exports = {
    getAllTasks,
    createTask, 
    updateTask, 
    getTask, 
    deleteTask
}
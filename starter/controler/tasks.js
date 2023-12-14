const { Long } = require("mongodb");
const Task = require(`../models/Tasks`);

//  you can get a task by .find() method, if no argument is passed in the find() method then it gives all the tasks that are present in the dataBase
const getAllTasks = async (req, res) => {
    try {
        const task = await Task.find({});   // gives all the tasks that are present in the dataBase
        res.status(201).json({task});
    }
    catch (error) {
        res.status(500).json( {msg: error} )
    }
}

//  because createTask is one of the method you can update your dataBase, thus i need to model.create here as well
//  for that i need to make it async await
const createTasks = async (req, res) => {
    //  this creates an error in case of validation because of no try catch block

    // const task = await Task.create(req.body);
    // res.status(201).json( {task} );

    try {
        const task = await Task.create(req.body);
        res.status(201).json( {task} );
    } catch (error) {
        res.status(500).json({ msg: error} );
    }
}


//  to find one specific task having specific property mentioned in the params, then we use .findOne()
const getTasks = async (req, res) => {
    try {
        const {id: taskID} = req.params;
        const task = await Task.findOne({_id: taskID});
        
        //  if no such id existed
        if(!task) {
            return res.status(404).json({msg: `No task with ID: ${taskID}`});
        }

        res.status(201).json({task});

    }
    catch (error) {
        res.status(500).json({ msg: error} );
    }
}

const updateTasks = async (req, res) => {
    try {
        const {id:taskID} = req.params;
        const task = await Task.findOneAndUpdate({_id:taskID}, req.body, {
            new: true,  //  If not this, then you wil get same old value ever after updation
            runValidators: true //  the validations we set for Schema work only for the post method, so update can lead to missing values, thus we neet to runValidations
        })

        if(!task) {
            return res.status(404).json({msg: `No task with ID: ${taskID}`});
        }

        res.status(201).json({task});

    } catch (error) {
        res.status(500).json({ msg: error} );
    }
}


//  delete task can be done using findOneAndDelete
const deleteTasks = async (req, res) => {

    try {
        const {id: taskID} = req.params;
        const task = await Task.findOneAndDelete({_id: taskID});

        //  No task found
        if(!task) {
            return res.status(404).json({msg: `No task with id: ${taskID}`});
        }

        return res.status(201).json({task});

    } catch (error) {
        res.status(500).json({ msg: error} );
    }
}

module.exports = {
    getAllTasks,
    createTasks,
    getTasks,
    updateTasks,
    deleteTasks,
};
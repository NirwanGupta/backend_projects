const getAllTasks = (req, res) => {
    res.status(200).send(`all Items`);
}

const createTasks = (req, res) => {
    res.status(200).json(req.body);
}

const getTasks = (req, res) => {
    res.status(200).json({id : req.params.id});
}

const updateTasks = (req, res) => {
    res.status(200).send(`task updated`);
}

const deleteTasks = (req, res) => {
    res.status(200).send(`task deleted`);
}

module.exports = {
    getAllTasks,
    createTasks,
    getTasks,
    updateTasks,
    deleteTasks,
};
const Todo = require("../models/Todo");

const isValidTodoId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

const createTodo = async (req, res) => {
  try {
    const body = req.body || {};
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await Todo.create({
      title,
      description: body.description,
      completed: body.completed,
    });

    return res.status(201).json(todo);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    console.error("Create todo error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch (error) {
    console.error("Get todos error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTodoById = async (req, res) => {
  try {
    if (!isValidTodoId(req.params.id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.status(200).json(todo);
  } catch (error) {
    console.error("Get todo error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateTodo = async (req, res) => {
  try {
    if (!isValidTodoId(req.params.id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const body = req.body || {};

    if (Object.prototype.hasOwnProperty.call(body, "title")) {
      const title = typeof body.title === "string" ? body.title.trim() : "";

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
    }

    const allowedFields = ["title", "description", "completed"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, "title")) {
      updates.title = updates.title.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.status(200).json(todo);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    console.error("Update todo error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    if (!isValidTodoId(req.params.id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Delete todo error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};

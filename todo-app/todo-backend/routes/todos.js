const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

const statsMiddleware = async (req, res, next) => {
  const currentCount = await redis.getAsync('added_todos')

  if (!currentCount) {
    await redis.setAsync('added_todos', 1)
  } else {
    await redis.setAsync('added_todos', +currentCount + 1)
    console.log('Todo aded')
  }

  next()
}

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', statsMiddleware, async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo

  if (!todo) return res.sendStatus(404)

  res.send(todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = req.todo;
  const { text, done } = req.body

  console.log(done)

  if (!todo) return res.sendStatus(404)
  
  if (!text || done === undefined) {
    return res.status(400).json({ error: 'Must provide fields to update' });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(todo.id, { text, done }, { new: true });
    res.json(updatedTodo); 
  } catch (err) {
    console.error('Error updating todo: ', err)
    res.status(500)
  }

});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

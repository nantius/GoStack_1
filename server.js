// Server configs
const express = require('express');
const app = express();
app.use(express.json());

// Data storage
const projects = [{id: 1, title:'Project 1', tasks:["Tarefa 1"]}];
let cont_reqs = 0;

// Middlewares
app.use((req,res,next) => {
  console.log('Reqs until now: ', ++cont_reqs);
  return next();
});

function idExists(req, res, next){
  const {id} = req.params;
  let index = projects.findIndex(proj => {
    return proj.id == id;
  });
  if(index == -1) return res.status(400).json({message: "ID not found."});
  return next();
}

// Routes
app.post('/projects', (req, res) => {
  const {id, title, tasks} = req.body;
  const project = {id, title, tasks};
  projects.push(project);
  return res.json(project);
});

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.put('/projects/:id', idExists, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  let index = projects.findIndex(proj => {
    return proj.id == id;
  });
  projects[index].title = title;
  return res.json(projects[index]);
});

app.delete('/projects/:id', idExists, (req, res) => {
  const {id} = req.params;
  let index = projects.findIndex(proj => {
    return proj.id == id;
  });
  delete projects[index];
  return res.json({message: 'Project deleted.'});
});

app.post('/projects/:id/tasks', idExists, (req,res) => {
  const {id} = req.params;
  const {title} = req.body;
  let index = projects.findIndex(proj => {
    return proj.id == id;
  });
  projects[index].tasks.push(title);
  return res.json(projects[index]);
})

// Server start
app.listen(3000, () => console.log('Server started on port 3000.'));
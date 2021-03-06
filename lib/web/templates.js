
const Scheduler = require('../Scheduler.js')

module.exports = function(dbConf) {
  let scheduler = new Scheduler(dbConf)
  const app = require('express').Router()


  app.get('/', function(req, res) {
    res.redirect('/tasks')
  })
  
  app.get('/tasks', function(req, res) {
    scheduler.searchTasks(null, null, null, null, (err, tasks) => {
      res.render('tasks.dust', {
        tasks
      })
    })
  })
  
  app.get('/task/:taskName', function(req, res) {
    scheduler.fetchTask(req.params.taskName, (err, task) => {
      res.render('taskDetails.dust', {
        task
      })
    })
  })
  
  app.get('/job/:jobId', function(req, res) {
    scheduler.fetchJob(req.params.jobId, (err, job) => {
      res.render('jobDetails.dust', job)
    })
  })

  
  app.post('/api/task', function(req, res) {
    scheduler.scheduleTask({
      name: req.body.name,
      schedule: req.body.schedule,
      timeout: req.body.timeoutMs,
      enabled: req.body.enabled ? true : false
    }, (err) => {
      let errorMessage = err ? err.message : ''
      res.redirect(`/task/${req.body.name}?err=${errorMessage}`)
    })
  })
  
  app.get('/api/task/trigger/:taskName', function(req, res) {
    scheduler.triggerTask(req.params.taskName, (err) => {
      let errorMessage = err ? err.message : ''
      res.redirect(`/task/${req.params.taskName}?err=${errorMessage}`)
    })
  })
  return app
}

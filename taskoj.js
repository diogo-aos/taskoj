var taskoj = {};

// returns timestamp in ms
// var getTimestamp = function () { return window.performance.now();};
var getTimestamp = function(){ return Date.now();};

(function(module_var){
  var polling_period = Infinity;
  var min_period = Infinity;
  var task_list = Array();
  var loop = null;

  function search_task(id, task_list){
    for(var i = 0; i < task_list.length; i++)
      if (id == task_list[i].id)
        return task_list[i];
    return null;
  }

    function search_tasks(ids, task_list){
    var ret_list = [];
    for (var i = 0; i < ids.length; i++){
      var task = search_task(ids[i], task_list);
      if (task === null)
        throw 'task ' + ids[i] + ' does not exist';
      ret_list.push(task);
    }
    return ret_list;
  }

  module_var.remove = function(id){
    var task = search_task(id, task_list);
    for(var i = 0; i < task_list.length; i++)
      if (id == task_list[i].id){
        task_list.pop(i);
        // if no more tasks, stop loop
        if (task_list.length === 0) {
          clearInterval(loop);
          loop = null;
        }
        return true;
      }
    return false;
  };

  function check_task(task){
    console.log(task.id + ': execBefore: ' + task.execBefore.length + ' | execAfter: ' + task.execAfter.length);
    if (task.isPeriodic){
      // check if exceeded number of executions or run time
      var exceeded_tries = (task.tries > 0) && (task.nExecs >= task.tries);
      var exceeded_timeout = (task.timeout > 0) &&
            (getTimestamp() - task.startTimestamp >= task.timeout);
      if ( exceeded_tries || exceeded_timeout){
        module_var.remove(task.id);
        return;
      }

      if ((getTimestamp() - task.lastTimestamp) < (task.period)) return;
    }

    // execute tasks before
    // check_tasks(task.execBefore);
    for (i = 0; i < task.execBefore.length;){
      console.log(task.id);
      console.log(i);
      console.log(task.execBefore.length);
      check_task(task.execBefore[i]);
      i++;
    }

    console.log(task.id + ': finished before tasks ');

    task.func.apply(this, task.args);
    task.update();

    // execute tasks after
    check_tasks(task.execAfter);

    console.log(task.id + ': exiting task ');
  }

  function check_tasks(tasks){
    for (i = 0; i < tasks.length; i++){
      check_task(tasks[i]);
    }
    return true;
  }

  function checkTimeouts(){
    var periodic = task_list.filter(function(t){return t.isPeriodic;});
    periodic.forEach(check_task);
  }

  function addTasksToTask(task_ids, task, toList){

    var selected_tasks = search_tasks(task_ids, task_list);

    // check that none of the selected tasks are periodic
    var periodic_selected = selected_tasks.filter(function(t){return t.isPeriodic;});
    if (periodic_selected.length > 0)
      throw 'cannot add periodic tasks as callbacks to other tasks: ' + periodic_selected;

    selected_tasks.forEach(function(t){toList.push(t);}); // add tasks to dest list
    selected_tasks.forEach(function(t){t.parents.push(task);});  // add main task as parent of others
    return true;
  }

  function createBaseTask(id, func, args){
    var task = {
      'id': id,
      'func': func,
      'args': args,
      'execBefore': [],
      'execAfter': [],
      'startTimestamp': getTimestamp(),
      'lastTimestamp': null,
      'nExecs': 0
    };

    task.update = function() {task.lastTimestamp = getTimestamp(); task.nExecs++;};
    task.addBefore = function(task_ids) {addTasksToTask(task_ids, task, task.execBefore);};
    task.addAfter = function(task_ids) {addTasksToTask(task_ids, task, task.execAfter);};

    task_list.push(task);

    return task;
  }

  module_var.addPeriodicTask = function(id, func, args, period, timeout, tries, execFirst){
    timeout = (typeof timeout !== 'undefined') ?  timeout : 0;
    tries = (typeof tries !== 'undefined') ?  tries : 0;
    execFirst = (typeof execFirst !== 'undefined') ?  execFirst : true;

    // if execFirst, then lastTimestamp should have a delay higher then the period
    if (execFirst) lastTimestamp = getTimestamp() - period * 1000 * 2;
    else lastTimestamp = getTimestamp();

    // create and add new task
    var task = createBaseTask(id, func, args);  //  also adds to task list
    task.period = period;
    task.timeout = timeout;
    task.tries = tries;
    task.execFirst = execFirst;
    task.isPeriodic = true;
    task.lastTimestamp = lastTimestamp;

    if (period < min_period || loop === null) {
      min_period = period;
      polling_period = parseInt(min_period / 10) + 1;
      if (loop !== null)
        clearInterval(loop);
      loop = setInterval(checkTimeouts, polling_period);

    }
    return task;
  };

  module_var.addNonPeriodicTask = function(id, func, args, position){
    if (position != 'before' && position != 'after')
      throw 'position must be before or after';

    // create and add new task
    var task = createBaseTask(id, func, args);  // also adds to task list
    task.isPeriodic = false;
    task.parents = [];

    return task;
  };

})(taskoj);
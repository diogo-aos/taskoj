# Scheduler module

## Interface

### base task

| parameter   | description |
| ---------   | ----------- |
| id          | string that identifies the task |
| func        | function for the task to execute |
| args        | list of arguments to pass to the function when it is called |
| startTimestamp | timestamp of the moment when the task was created |
| lastTimestamp  | timestamp of the last time the task was executed |
| nExecs         | number of times the task has been executed |
| exec_before | list of tasks to be executed before executing the main task |
| exec_after  | list of tasks to be executed after executing the main task |


### addPeriodic

| parameter   | description |
| ---------   | ----------- |
| id          | string that identifies the task |
| func        | function for the task to execute |
| args        | list of arguments to pass to the function when it is called |
| period      | period at which the task is executed in milliseconds |
| timeout     | time after which the task stops running in milliseconds, 0 means it runs forever |
| tries       | number of executions until the task stops running, 0 means it runs forever |
| execFirst   | boolean indicating if the task should be executed as soon as it is added or not |
| exec_before | list of tasks to be executed before executing the main task |
| exec_after  | list of tasks to be executed after executing the main task |

### non periodic

| parameter | description |
| --------- | ----------- |
| task_id   | string that identifies the main task, can be other callback |
| id        | string that identifies the callback |
| func      | function to be executed |
| args      | list of arguments to pass to the function when it is called |
| position  | string `'before'` or `'after'` to indicate whether the function should be called before or after the main task |

Returns `false` if main task is not found.

### remove

| parameter | description |
| --------- | ----------- |
| id        | string that identifies the task to be removed |

Returns `false` if task is not found.

### periodic task

| parameter      | description |
| ---------      | ----------- |
| id             | string that identifies the task |
| func           | function for the task to execute |
| args           | list of arguments to pass to the function when it is called |
| period         | period at which the task is executed in milliseconds |
| timeout        | time after which the task stops running in milliseconds, 0 means it runs forever |
| tries          | number of executions until the task stops running, 0 means it runs forever |
| execFirst      | boolean indicating if the task should be executed as soon as it is added or not |
| exec_before    | list of tasks to be executed before executing the main task |
| exec_after     | list of tasks to be executed after executing the main task |
| lastTimestamp  | timestamp of the last time the task was executed |
| nExecs         | number of times the task has been executed |
| startTimestamp | timestamp of the moment when the task was created |
| isPeriodic     | boolean indicating if the task is periodic or not |

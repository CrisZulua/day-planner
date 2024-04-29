//TO DO: 
//Init git
//Funcion de borrado
//Funcion de edicion
//Implementar tabla de tareas en la mitad inferior de la pagina

import { Timeline } from "vis-timeline/esnext";
import { DataSet } from "vis-data/esnext";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

import randomColor from 'randomcolor';
//import "./src/items.css";

//Get all the elements

const addTaskForm = document.getElementById('addTaskForm');
const graphContainer = document.getElementById('graphContainer');

let timeline;
var items;
//Declare id variable
let tId = 0;
//Declare arrays
let tasksArray = [];
//Local storage array
let idsArray = [];

//Get current date
const today = new Date();

//Define vis.js timeline options
var options = {
    editable: true,
    showCurrentTime: true,
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
    height: '92vh',
    orientation: {
        axis: 'top',
        item: 'top'
    },

    onRemove: function (item, callback) {
        //Remove item from tasksArray and remove id from idsArray and redraw the timeline
        if(item.id != null){
            alert(`Are you sure you want to delete this task ${item.id}?`);
            //Get the indexes of the items in arrays
            let indexOnTasksArray = tasksArray.findIndex(task => task.id === item.id);
            let indexOnIdsArray = idsArray.findIndex(id => id === item.id);
            //Remove the items without leaving empty spaces
            tasksArray.splice(indexOnTasksArray,1);
            idsArray.splice(indexOnIdsArray,1);
            //Update session Storage
            sessionStorage.removeItem(item.id.toString());
            sessionStorage.setItem('tasksIdsArray', JSON.stringify(idsArray));
            //Update timeline
            timeline.setItems(tasksArray);
            callback(null);
        }else{
            alert(`The task with id ${item.id} doesn't exist`);
            callback(null);
        }
    },

    onMove: function (item,callback){
        //Updates the time stamps of the task moved
        alert(`Are you sure you want to move this task ${item.id}?`);
        if(item.id!= null && item.start < item.end){
            let indexOnTasksArray = tasksArray.findIndex(task => task.id === item.id);
            tasksArray[indexOnTasksArray].start = item.start;
            tasksArray[indexOnTasksArray].end = item.end;
            sessionStorage.setItem(item.id.toString(), JSON.stringify(tasksArray[indexOnTasksArray]));
            timeline.setItems(tasksArray);
            //Update the time stamps of the task moved
            callback(item);
        }else{
            //Doesn't update the time stamps
            //TO DO: implement a message to the user about the error
            callback(null);
        }
    }
};


//Get session storage data, and initialize arrays ant timeline
getSessionStorageData();


//EVENTS
//Set event listeners for form
addTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getTaskInfo();
    updateTimeLine();
});


//FUNCTIONS

//Get task info
function getTaskInfo(){

    const taskTitle = addTaskForm.elements.namedItem('taskTitle').value;
    const taskDescription = addTaskForm.elements.namedItem('taskDesc').value;
    const taskStart = addTaskForm.elements.namedItem('taskStart').value;
    const taskEnd = addTaskForm.elements.namedItem('taskEnd').value;

    //Reset form
    addTaskForm.reset();

    //Check for title field length
    if(taskTitle.length > 50){
        taskTitle = "";
    }

    //Check for description field length
    if(taskDescription.length > 250){
        taskDescription = "";
    }
    //Format task start and end date
    //Start date
    const startArray = taskStart.split(':');
    const startHours = parseInt(startArray[0]);
    const startMinutes = parseInt(startArray[1]);
    //End date
    const endArray = taskEnd.split(':');
    const endHours = parseInt(endArray[0]);
    const endMinutes = parseInt(endArray[1]);

    //Set dat format as new Date(YYYY, MM, DD, HH, mm)
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHours, startMinutes);
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHours, endMinutes);
    
    //Generate random color
    const color = randomColor({luminosity: 'light', hue: "green"});
    //Create task Object
    const task = {
        id: ++tId,
        content: taskTitle,
        title: taskDescription,
        start: startDate,
        end: endDate,
        style: `background-color: ${color}; border-color: ${color};`,	
        type: 'range',
        editable: true,  
    }
    //Add task to DB
    addTaskToDB(task);
    //Draw timeline
}

function addTaskToDB(task){
    //Add task to tasksArray
    tasksArray.push(task);
    //Add task id to idArray
    idsArray.push(task.id);
    //Add array to local storage
    sessionStorage.setItem('tasksIdsArray', JSON.stringify(idsArray));
    //implement session storage through sessionStorage API
    sessionStorage.setItem(task.id.toString(), JSON.stringify(task));
    //At this point the ids are save so the app knows how many task objects
    //there are in the sessionStorage Object
}

function getSessionStorageData(){
    //This function gets the data from the sessionStorage, populate the arrays and create the timeline
    //Get ids from sessionStorage
    if(sessionStorage.getItem('tasksIdsArray')){
        idsArray = JSON.parse(sessionStorage.getItem('tasksIdsArray'));
        //Get tasks from sessionStorage
        idsArray.forEach(element => {
            const taskRetrieved = JSON.parse(sessionStorage.getItem(element));
            if(taskRetrieved){
                tasksArray.push(taskRetrieved);
            }else{
                console.error(`Task with id ${element} not found in sessionStorage`);
            }
        });
    }
    //Once the DB is set up, we can get the id from the DB last task id
    if(idsArray.length > 0){
        tId = idsArray[idsArray.length-1];
    };
    //Create Dataset
    items = new DataSet(tasksArray);
    //Create timeline
    timeline = new Timeline(graphContainer, items, options);
    
}

function updateTimeLine(){
    //Function to update the timeline with the new task added
    timeline.setItems(tasksArray);
}


//Add event listener for deleted items
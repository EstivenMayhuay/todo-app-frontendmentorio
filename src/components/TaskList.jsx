import { useState } from "react";
import TaskItem from "./TaskItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TaskList = ({
    tasks = [], 
    setTasks,
    getTasks = () => {},
    deleteTask = () => {},
    theme
}) => {
    const taskFinish = async (task_id, status) => {
        try {
            const res = await fetch(`http://127.0.0.1/apiTodo/todos/complete/${task_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    status
                })
            });
            getTasks();
        } catch (error) {
            
        }
    }

    const handleDragDrop = (result) => {
        const {source, destination} = result;
    
        if(!destination) return;
    
        const copiedTasks = Array.from(tasks);
        const [removedTask] = copiedTasks.splice(source.index, 1);
        copiedTasks.splice(destination.index, 0, removedTask);
    
        setTasks(copiedTasks)
      }
    

    return (
        <ul>
            <DragDropContext
                onDragEnd={(result) => handleDragDrop(result)}
            >
                <div>
                    <Droppable droppableId="todo">
                        {(provided) => (
                            <div className="" {...provided.droppableProps} ref={provided.innerRef}>
                                {
                                    tasks &&
                                    tasks.length > 0 &&
                                    tasks.map((task, i) => (
                                        <Draggable
                                            draggableId={String(i)}
                                            index={i}
                                            key={i}
                                        >
                                            {(provided) => (
                                                <div
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <TaskItem
                                                        task={task}
                                                        onDeleteTask={deleteTask} onCompleteTask={taskFinish} theme={theme}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </ul>
    )
}

export default TaskList;
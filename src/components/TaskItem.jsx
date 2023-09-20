import { useState } from "react";
import './TaskItem.css';

const TaskItem = ({
    task = {},
    onDeleteTask = () => {},
    onCompleteTask = () => {},
    theme,
    ...props
}) => {
    return (
        <li className="taskItem position-relative d-flex gap-4 align-items-center py-2" {...props}>
            <div className={`${task.status == 1 ? 'circle--active' : 'circle'}`}  onClick={() => onCompleteTask(task.id, task.status == 1 ? false : true)}>
                {
                    task.status == 1 &&
                    <img src="/icon-check.svg" />
                }
            </div>
            <p className={`taskItem__text text-color-primary fs-6 ${task.status == 1 ? 'text-decoration-line-through' : ''}`}>{task.name}</p>
            <button className="taskItem__delete d-none position-absolute top-0 end-0 bg-transparent outline-0 border-0 fs-4" id={`btnDelete-${task.id}`} onClick={() => onDeleteTask(task.id)}>
                {
                    theme === 'dark'
                    ? <img src="/icon-cross-white.svg" alt={task.name} width={18} height={18} />
                    : <img src="/icon-cross.svg" alt={task.name} width={18} height={18} />
                }
            </button>
        </li>
    )
}

export default TaskItem;

export function taskCardElement(list, taskName, taskId, dueDate){
    let taskCard = document.createElement("li");
    taskCard.className = "task-card";
    taskCard.id = `task${taskId}-card`;

    let contentDiv = document.createElement("div");
    contentDiv.className = "task-card__content";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `task${taskId}-checkbox`;
    checkbox.className = "task-card__checkbox";

    let textContentDiv = document.createElement("div");
    textContentDiv.className = "task-card__text-content";

    let titleSpan = document.createElement("span");
    titleSpan.className = "task-card__title";
    titleSpan.textContent = taskName;

    textContentDiv.appendChild(titleSpan);

    if (dueDate != "Invalid Date") {
        let date = dueDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

        let dueSpan = document.createElement("span");
        dueSpan.className = "task-card__date";
        dueSpan.textContent = date;
        textContentDiv.appendChild(dueSpan);
    }

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(textContentDiv);

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "task-card__delete-btn";

    let deleteIcon = document.createElement("ion-icon");
    deleteIcon.className = "task-card__delete-btn_icon";
    deleteIcon.name = "close";

    deleteBtn.appendChild(deleteIcon);

    taskCard.appendChild(contentDiv);
    taskCard.appendChild(deleteBtn);

    taskCard.addEventListener('mouseover', ()=>deleteBtn.style.display = "flex");
    taskCard.addEventListener('mouseout', ()=>deleteBtn.style.display = "none");

    deleteBtn.addEventListener('click', ()=>list.deleteTask(taskId));

    checkbox.addEventListener('change', (event) => {
        list.toggleTaskStatus(taskId);
    });

    return taskCard;
}

// Creates and returns DOM taskCard element
export function taskCardElement(list, taskName, taskId, dueDate, completed){
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
        let date = dueDate.toLocaleDateString('en-US', 
            {   timeZone: "UTC", 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }).replace(/,/g, '');

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
    if (completed){
        checkbox.checked = completed;
    }

    return taskCard;
}

// Creates and returns DOM listLink element
export function listLinkElement(listName, completedTasks){
    let li = document.createElement('li');

    let a = document.createElement('a');
    a.href = `#${listName}`;
    a.className = 'list-link';
    a.id = `${listName}-anchor`;
    li.appendChild(a);

    let ionIcon = document.createElement('ion-icon');
    ionIcon.name = 'list-outline';
    ionIcon.className = 'list-link__icon';
    a.appendChild(ionIcon);
    
    let div = document.createElement('div');
    div.className = 'list-link__content';
    a.appendChild(div);

    let spanTitle = document.createElement('span');
    spanTitle.className = 'list-link__title';
    spanTitle.textContent = listName;
    div.appendChild(spanTitle);

    let spanTasksCount = document.createElement('span');
    spanTasksCount.className = 'list-link__tasks-count';
    spanTasksCount.id = `${listName}-link-count`;
    spanTasksCount.textContent = `${completedTasks} Tasks`;
    div.appendChild(spanTasksCount);

    return li;
}
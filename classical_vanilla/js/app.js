// Je remplis artificiellement le localStorage.tasks
// localStorage.tasks = JSON.stringify([
//     {id: 1, content: "Tâche 1", completed: true},
//     {id: 2, content: "Tâche 2", completed: false}
// ]);

// {id:xxx, content: 'xx', completed:xxx}
function getTaskDomElement (task) {
    const li = document.createElement("li");
    // J'ajoute le data-id avec l'id de la task
    li.dataset.id = task.id;
    if (task.completed) {
        li.classList.add('completed');
    } 
    li.innerHTML = `
        <div class="view">
            <input class="toggle" type="checkbox" ${ task.completed ? 'checked': '' } />
            <label>${ task.content }</label>
            <button class="destroy"></button>
        </div>`;
    return li;
}

// 1. Initialiser le localstorage
// tasks -> []
    if (localStorage.tasks === undefined) {
        localStorage.tasks = JSON.stringify([]);
    }

// 2. Afficher les tasks dans le DOM
const ul = document.querySelector(".todo-list");
const tasks = JSON.parse(localStorage.tasks);
tasks.forEach(task => {
  ul.appendChild(getTaskDomElement(task));
});

// AJOUT D'UNE TÂCHE ------------------------------------------
// Keyup, enter et que le champ n'est pas vide
// Créer un li et l'ajouter dans le UL
// Il va falloir mettre à jour le tableau tasks et le localStorage
document.querySelector(".new-todo").addEventListener("keyup",function (e){
    if(e.key === "Enter" && this.value != ''){
        // 1. Créer un objet littéral
        const newTask = {
            id: new Date().valueOf(),
            content: this.value,
            completed: false,
        };

        // 2. Ajouter un li dans le ul (insertBefore)
        ul.insertBefore(getTaskDomElement(newTask), ul.firstChild);
        
        // 3. Ajouter la tâche dans tasks (push)
        tasks.unshift(newTask);

        // 4. Ecraser le localStorage.tasks avec les tasks
        //localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.tasks = JSON.stringify(tasks);

        // 5. Vider le champs
        this.value = '';
        renderNotCompletedCount();
        checkCompletedTasks();
    }
});
    
// TERMINER UNE TÂCHE ------------------------------------------
// Quand on change le checkbox
// 1. On ajoute ou on supprime la classe 'completed' sur le li correspondant (toggle)
// 2. On Modifie la task dans le tasks (true/false)
// 3. on écrase le localStorage.tasks

// Capture par sélection
// document.querySelectorAll(".toggle").forEach(trigger => {
//     trigger.addEventListener('change', function() {
//         this.closest('li').classList.toggle("completed");
//     })
// });

// Capture par délégation
// document.addEventListener('change', (e) => {
//     if (e.target.matches('.toggle')) {
//         e.target.closest('li').classList.toggle("completed");
//         // On récupère l'id dans le li
//         const id = e.target.closest('li').dataset.id;

//         // On récupère dans le tableau tasks la task qui correspond à l'id
//         const task = tasks.find(task => task.id == id);
//         task.completed = !task.completed;

//         // J'écrase le localStorage.tasks
//         localStorage.tasks = JSON.stringify(tasks);
//         renderNotCompletedCount();
//     }
// });

// supprimé un élément LI

// document.querySelectorAll('.destroy').forEach((toggle) => {
//     toggle.onclick = function (e) {
//         const id = e.target.closest('li').dataset.id;
//         const task = tasks.findIndex(task => task.id == id); 
//         this.closest("li").remove();
//         tasks.splice(task, 1);
//         localStorage.tasks = JSON.stringify(tasks);
//     }
// });

const todoul = document.querySelector('.todo-list');

todoul.addEventListener('click', function(e){
  if (e.target.matches('.toggle')) {
    e.target.closest('li').classList.toggle("completed");
    // On récupère l'id dans le li
    const id = e.target.closest('li').dataset.id;

    // On récupère dans le tableau tasks la task qui correspond à l'id
    const task = tasks.find(task => task.id == id);
    task.completed = !task.completed;

    // J'écrase le localStorage.tasks
    localStorage.tasks = JSON.stringify(tasks);
    renderNotCompletedCount();
    checkCompletedTasks();
} 
else if (e.target.matches('.destroy')){
  console.log('destroy');
  const id = e.target.closest('li').dataset.id;
  const taskIndex = tasks.findIndex(task => task.id == id);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    localStorage.tasks = JSON.stringify(tasks);
  }

  e.target.closest('li').remove();
  renderNotCompletedCount();
  checkCompletedTasks();
}
});

// Faire le compte des tâches non completed + configuration du filters

function renderNotCompletedCount() {
  const count = document.querySelectorAll('.todo-list li:not(.completed)').length;
  document.querySelector('.count-number').innerHTML = count;

  const filterActive = document.querySelector('.filters a[data-filter="active"]');
  const filterCompleted = document.querySelector('.filters a[data-filter="completed"]');

  const allTasks = document.querySelectorAll('.todo-list li');
  allTasks.forEach(task => {
    task.classList.remove('hidden');
  });

  if (filterActive.classList.contains('selected')) {
    const completedTasks = document.querySelectorAll('.todo-list li.completed');
    completedTasks.forEach(task => {
      task.classList.add('hidden');
    });
  } else if (filterCompleted.classList.contains('selected')) {
    const nonCompletedTasks = document.querySelectorAll('.todo-list li:not(.completed)');
    nonCompletedTasks.forEach(task => {
      task.classList.add('hidden');
    });
  }
}



// Faire le bouton clear Completed.. 

const clear = document.querySelector('.clear-completed'); 
const completedtasks = tasks.filter(task => task.completed);

    // Afficher ou pas le bouton clear-completed 

function checkCompletedTasks() {
    const completedTasks = tasks.filter(task => task.completed);
    clear.style.display = completedTasks.length > 0 ? 'block' : 'none';
  };

  clear.addEventListener('click', function() {
    const completedTasks = tasks.filter(task => task.completed);
  
    // Supprimer les tâches complétées du tableau des tâches
    completedTasks.forEach(completedTask => {
      const taskIndex = tasks.findIndex(task => task.id === completedTask.id);
      tasks.splice(taskIndex, 1);
    });
  
    // Mettre à jour le localStorage
    localStorage.tasks = JSON.stringify(tasks);
  
    // Supprimer les éléments DOM des tâches complétées
    const completedTaskElements = document.querySelectorAll('.todo-list li.completed');
    completedTaskElements.forEach(taskElement => {
      taskElement.remove();
    });
    renderNotCompletedCount();
    checkCompletedTasks();
  });

  // affichages des boutons du filters

  const filters = document.querySelectorAll('.filters a');

  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Supprime la classe "selected" de tous les boutons de filtre
      filters.forEach(filter => {
        filter.classList.remove('selected');
      });
      // Ajoute la classe "selected" au bouton de filtre actuellement cliqué
      this.classList.add('selected'); 
      renderNotCompletedCount();
      checkCompletedTasks();
    });
  });

  // modifier le contenu d'une tâche. 

  // Modifier une tâche
  
  function editTask(taskElement) {
    const label = taskElement.querySelector('label');
    const input = document.createElement('input');
    input.className = 'edit';
    input.value = label.textContent;
    taskElement.classList.add('editing');
    taskElement.appendChild(input);
    input.focus();
  
    input.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        const newContent = input.value.trim();
        if (newContent !== '') {
          const id = taskElement.dataset.id;
          const task = tasks.find(task => task.id == id);
          task.content = newContent;
          localStorage.tasks = JSON.stringify(tasks);
          label.textContent = newContent;
        }
        exitEditingMode(taskElement);
      } else if (e.key === 'Escape') {
        exitEditingMode(taskElement);
      }
    });
  }
  
  function exitEditingMode(taskElement) {
    const input = taskElement.querySelector('.edit');
    taskElement.classList.remove('editing');
    label.style.display = 'block';
    if (input) {
      taskElement.removeChild(input);
    }
  }
  
  // Lors du double-clic sur une tâche, activer le mode édition
  document.querySelector('.todo-list').addEventListener('dblclick', function(e) {
    if (e.target.matches('label')) {
      const taskElement = e.target.closest('li');
      editTask(taskElement);
    }
  });


// Lancement de base. 
  renderNotCompletedCount();
  checkCompletedTasks();

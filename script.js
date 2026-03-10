// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Function to add a new todo item
    function addTodo(todoText) {
        const ul = document.querySelector('ul');
        const li = document.createElement('li');
        li.textContent = todoText;

        // Create delete button for the new todo item
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            ul.removeChild(li);
        });
        
        // Append elements to the list item
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    }

    // Function to handle form submission
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        const input = document.querySelector('input[name="todo"]');
        const todoText = input.value.trim();
        if (todoText) {
            addTodo(todoText);
            input.value = '';
        }
    });
});
```

This JavaScript file handles user interactions and dynamic updates for the Todo List application. It includes functions to add new todo items and handle form submissions, ensuring that each todo item has a delete button associated with it.
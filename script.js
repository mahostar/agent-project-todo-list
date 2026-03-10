// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Function to add a new task
    document.getElementById('add-task-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const taskInput = document.getElementById('task-input');
        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `task=${encodeURIComponent(taskInput.value)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                taskInput.value = '';
                loadTodos();
            }
        });
    });

    // Function to toggle the completion status of a task
    function toggleTask(id) {
        fetch(`/toggle/${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadTodos();
                }
            });
    }

    // Function to delete a task
    function deleteTask(id) {
        fetch(`/delete/${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadTodos();
                }
            });
    }

    // Function to load and display tasks from the server
    function loadTodos() {
        fetch('/')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const todoList = document.getElementById('todo-list');
                todoList.innerHTML = doc.getElementById('todo-list').innerHTML;
                
                // Add event listeners to dynamically added buttons
                document.querySelectorAll('.toggle-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        toggleTask(parseInt(this.getAttribute('data-id')));
                    });
                });

                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        deleteTask(parseInt(this.getAttribute('data-id')));
                    });
                });
            });
    }

    // Load initial tasks when the page loads
    loadTodos();
});
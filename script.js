const apiURL = 'http://localhost:5000';

function login(username, password) {
    $.post(`${apiURL}/login`, { username, password })
        .done(token => {
            localStorage.setItem('token', token);
            $('#loginForm').hide();
            $('#logoutBtn').show();
            loadTodos();
        })
        .fail(() => alert('Invalid credentials'));
}

function logout() {
    localStorage.removeItem('token');
    $('#loginForm').show();
    $('#logoutBtn').hide();
    $('#todoList').empty();
}

function createTodo(task) {
    $.post(`${apiURL}/todos`, { task }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        .done(() => loadTodos())
        .fail(() => alert('Failed to add todo'));
}

function updateTodo(todoId, completed) {
    $.put(`${apiURL}/todos/${todoId}`, { completed }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        .done(() => loadTodos())
        .fail(() => alert('Failed to update todo'));
}

function deleteTodo(todoId) {
    $.ajax({
        url: `${apiURL}/todos/${todoId}`,
        type: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        success: () => loadTodos(),
        error: () => alert('Failed to delete todo')
    });
}

function loadTodos() {
    $.get(`${apiURL}/todos`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        .done(todos => {
            $('#todoList').empty();
            todos.forEach(todo => {
                const li = $('<li>').text(todo.task);
                const deleteBtn = $('<button>').addClass('btn btn-danger btn-sm ml-2').text('Delete');
                deleteBtn.click(() => deleteTodo(todo.id));
                li.append(deleteBtn);
                if (todo.completed) {
                    li.addClass('text-decoration-line-through');
                }
                $('#todoList').append(li);
            });
        })
        .fail(() => alert('Failed to load todos'));
}

$(document).ready(function() {
    const token = localStorage.getItem('token');
    if (token) {
        $('#loginForm').hide();
        $('#logoutBtn').show();
        loadTodos();
    }

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        login(username, password);
    });

    $('#logoutBtn').click(logout);

    $('#todoForm').on('submit', function(e) {
        e.preventDefault();
        const task = $('#task').val();
        createTodo(task);
        $('#task').val('');
    });
});
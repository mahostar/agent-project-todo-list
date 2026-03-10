document.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
        el: '#app',
        data: {
            username: '',
            password: '',
            taskTitle: '',
            taskDescription: '',
            tasks: []
        },
        methods: {
            async register() {
                try {
                    const response = await fetch('/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: this.username, password: this.password })
                    });
                    const data = await response.json();
                    alert(data.message);
                } catch (error) {
                    console.error('Error registering:', error);
                }
            },
            async login() {
                try {
                    const response = await fetch('/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: this.username, password: this.password })
                    });
                    const data = await response.json();
                    alert(data.message);
                    if (data.message === 'Login successful') {
                        this.fetchTasks();
                    }
                } catch (error) {
                    console.error('Error logging in:', error);
                }
            },
            async logout() {
                try {
                    const response = await fetch('/logout', { method: 'POST' });
                    const data = await response.json();
                    alert(data.message);
                    this.tasks = [];
                } catch (error) {
                    console.error('Error logging out:', error);
                }
            },
            async addTask() {
                try {
                    const response = await fetch('/tasks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: this.taskTitle, description: this.taskDescription })
                    });
                    const data = await response.json();
                    alert(data.message);
                    if (data.message === 'Task created successfully') {
                        this.fetchTasks();
                    }
                } catch (error) {
                    console.error('Error adding task:', error);
                }
            },
            async fetchTasks() {
                try {
                    const response = await fetch('/tasks');
                    const data = await response.json();
                    this.tasks = data;
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            }
        },
        watch: {
            tasks(newVal) {
                const taskList = document.getElementById('tasks');
                taskList.innerHTML = '';
                newVal.forEach(task => {
                    const li = document.createElement('li');
                    li.textContent = `${task.title} - ${task.description}`;
                    taskList.appendChild(li);
                });
            }
        }
    });
});
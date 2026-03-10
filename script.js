// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    M.AutoInit();
});

const app = Vue.createApp({
    data() {
        return {
            newTask: {
                title: '',
                description: ''
            },
            tasks: []
        };
    },
    methods: {
        async addTask() {
            try {
                const response = await fetch('/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.newTask)
                });
                const result = await response.json();
                alert(result.message);
                this.fetchTasks();
                this.newTask.title = '';
                this.newTask.description = '';
            } catch (error) {
                console.error('Error adding task:', error);
            }
        },
        async fetchTasks() {
            try {
                const response = await fetch('/tasks');
                const tasksData = await response.json();
                this.tasks = tasksData.tasks;
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        },
        async updateTask(taskId, completed) {
            try {
                const response = await fetch(`/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed })
                });
                const result = await response.json();
                alert(result.message);
                this.fetchTasks();
            } catch (error) {
                console.error('Error updating task:', error);
            }
        },
        async deleteTask(taskId) {
            try {
                const response = await fetch(`/tasks/${taskId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                alert(result.message);
                this.fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    },
    mounted() {
        this.fetchTasks();
    }
});

app.mount('#app');
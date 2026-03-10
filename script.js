// Add event listener to form submission
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const taskInput = document.querySelector('input[name="task"]');
    if (taskInput.value.trim() !== '') { // Check if input is not empty
        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `task=${encodeURIComponent(taskInput.value)}`
        })
        .then(response => response.json())
        .then(data => {
            // Clear input field and reload page
            taskInput.value = '';
            location.reload();
        });
    }
});

// Add event listener to toggle complete links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        const todoId = this.getAttribute('href').split('/').pop(); // Extract todo ID from href
        fetch(`/complete/${todoId}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            // Reload page to update list
            location.reload();
        });
    });
});
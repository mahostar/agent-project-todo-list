from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# In-memory list to store todos
todos = []

@app.route('/')
def index():
    # Display the todo list
    return render_template('index.html', todos=todos)

@app.route('/add', methods=['POST'])
def add_todo():
    # Add a new todo from form data
    new_todo = request.form['todo']
    todos.append(new_todo)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
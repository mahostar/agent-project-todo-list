from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)

@app.route('/')
class IndexView:
    def get(self):
        todos = Todo.query.all()
        return render_template('index.html', todos=todos)

@app.route('/add', methods=['POST'])
class AddTodoView:
    def post(self):
        task = request.form['task']
        new_todo = Todo(task=task)
        db.session.add(new_todo)
        db.session.commit()
        return redirect(url_for('IndexView.get'))

@app.route('/complete/<int:todo_id>')
class CompleteTodoView:
    def get(self, todo_id):
        todo = Todo.query.get(todo_id)
        todo.completed = not todo.completed
        db.session.commit()
        return redirect(url_for('IndexView.get'))

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
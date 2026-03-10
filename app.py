from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(120), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 409
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)

@app.route('/todos', methods=['POST'])
@jwt_required()
def create_todo():
    current_user_id = get_jwt_identity()
    task = request.json.get('task')
    new_todo = Todo(task=task, user_id=current_user_id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({'message': 'Todo created successfully'}), 201

@app.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    current_user_id = get_jwt_identity()
    todos = Todo.query.filter_by(user_id=current_user_id).all()
    return jsonify([{'id': todo.id, 'task': todo.task, 'completed': todo.completed} for todo in todos])

@app.route('/todos/<int:todo_id>', methods=['PUT'])
@jwt_required()
def update_todo(todo_id):
    current_user_id = get_jwt_identity()
    todo = Todo.query.filter_by(id=todo_id, user_id=current_user_id).first()
    if not todo:
        return jsonify({'message': 'Todo not found'}), 404
    task = request.json.get('task')
    completed = request.json.get('completed')
    todo.task = task
    todo.completed = completed
    db.session.commit()
    return jsonify({'message': 'Todo updated successfully'}), 200

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    current_user_id = get_jwt_identity()
    todo = Todo.query.filter_by(id=todo_id, user_id=current_user_id).first()
    if not todo:
        return jsonify({'message': 'Todo not found'}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted successfully'}), 200

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
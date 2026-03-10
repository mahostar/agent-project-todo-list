from flask import Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Mock database for user and tasks
users_db = {}
tasks_db = {}

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = generate_password_hash(data['password'])
    
    if username in users_db:
        return jsonify({'message': 'Username already exists'}), 400
    
    user_id = str(uuid.uuid4())
    users_db[username] = {'user_id': user_id, 'password': password}
    return jsonify({'message': 'User registered successfully', 'user_id': user_id}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    if username not in users_db:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    if check_password_hash(users_db[username]['password'], password):
        session['user_id'] = users_db[username]['user_id']
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401
    
    user_id = session['user_id']
    
    if request.method == 'POST':
        data = request.get_json()
        task_id = str(uuid.uuid4())
        tasks_db[task_id] = {'user_id': user_id, 'title': data['title'], 'description': data['description'], 'completed': False}
        return jsonify({'message': 'Task created successfully', 'task_id': task_id}), 201
    
    if request.method == 'GET':
        user_tasks = [task for task in tasks_db.values() if task['user_id'] == user_id]
        return jsonify(user_tasks), 200

@app.route('/tasks/<task_id>', methods=['PUT', 'DELETE'])
def task(task_id):
    if 'user_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401
    
    if request.method == 'PUT':
        data = request.get_json()
        if task_id not in tasks_db:
            return jsonify({'message': 'Task not found'}), 404
        
        if tasks_db[task_id]['user_id'] != session['user_id']:
            return jsonify({'message': 'Unauthorized'}), 401
        
        tasks_db[task_id].update(data)
        return jsonify({'message': 'Task updated successfully'}), 200
    
    if request.method == 'DELETE':
        if task_id not in tasks_db:
            return jsonify({'message': 'Task not found'}), 404
        
        if tasks_db[task_id]['user_id'] != session['user_id']:
            return jsonify({'message': 'Unauthorized'}), 401
        
        del tasks_db[task_id]
        return jsonify({'message': 'Task deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime
import os
from bson import ObjectId

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['registration_db']
users_collection = db['users']

users_collection.create_index("email", unique=True)

def validate_registration_data(data):

    errors = {}

    # Full Name validation
    full_name = data.get('fullName', '').strip()
    if not full_name:
        errors['fullName'] = 'Full Name is required'
    elif len(full_name) < 2:
        errors['fullName'] = 'Full Name must be at least 2 characters long'

    # Email validation
    email = data.get('email', '').strip().lower()
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not email:
        errors['email'] = 'Email is required'
    elif not re.match(email_pattern, email):
        errors['email'] = 'Must be a valid email format'

    # Phone validation
    phone = data.get('phone', '').strip()
    phone_digits = re.sub(r'\D', '', phone)
    if not phone:
        errors['phone'] = 'Phone number is required'
    elif len(phone_digits) < 10 or len(phone_digits) > 15:
        errors['phone'] = 'Phone must contain 10 to 15 digits only'
    elif not phone_digits.isdigit():
        errors['phone'] = 'Phone must contain digits only'

    # Password validation
    password = data.get('password', '')
    if not password:
        errors['password'] = 'Password is required'
    elif len(password) < 6:
        errors['password'] = 'Password must be at least 6 characters long'

    # Confirm Password validation
    confirm_password = data.get('confirmPassword', '')
    if not confirm_password:
        errors['confirmPassword'] = 'Confirm Password is required'
    elif password != confirm_password:
        errors['confirmPassword'] = 'Passwords do not match'

    return errors

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400


        validation_errors = validate_registration_data(data)
        if validation_errors:
            return jsonify({
                'error': 'Validation failed',
                'errors': validation_errors
            }), 400


        existing_user = users_collection.find_one({'email': data['email'].strip().lower()})
        if existing_user:
            return jsonify({
                'error': 'Validation failed',
                'errors': {'email': 'Email already registered'}
            }), 400


        user_data = {
            'fullName': data['fullName'].strip(),
            'email': data['email'].strip().lower(),
            'phone': re.sub(r'\D', '', data['phone'].strip()),  # Store only digits
            'password': generate_password_hash(data['password']),  # Hash password
            'createdAt': datetime.utcnow(),
            'isActive': True
        }


        result = users_collection.insert_one(user_data)

        response_data = {
            'id': str(result.inserted_id),
            'fullName': user_data['fullName'],
            'email': user_data['email'],
            'phone': user_data['phone'],
            'createdAt': user_data['createdAt'].isoformat()
        }

        return jsonify({
            'message': 'User registered successfully',
            'user': response_data
        }), 201

    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/api/users', methods=['GET'])
def get_all_users():

    try:
        users = list(users_collection.find({}, {'password': 0}))  # Exclude password


        for user in users:
            user['_id'] = str(user['_id'])
            if 'createdAt' in user:
                user['createdAt'] = user['createdAt'].isoformat()

        return jsonify({
            'message': 'Users retrieved successfully',
            'users': users,
            'count': len(users)
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):

    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)}, {'password': 0})

        if not user:
            return jsonify({'error': 'User not found'}), 404

        user['_id'] = str(user['_id'])
        if 'createdAt' in user:
            user['createdAt'] = user['createdAt'].isoformat()

        return jsonify({
            'message': 'User retrieved successfully',
            'user': user
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/api/login', methods=['POST'])
def login_user():

    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400


        user = users_collection.find_one({'email': data['email'].strip().lower()})

        if not user or not check_password_hash(user['password'], data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401


        response_data = {
            'id': str(user['_id']),
            'fullName': user['fullName'],
            'email': user['email'],
            'phone': user['phone']
        }

        return jsonify({
            'message': 'Login successful',
            'user': response_data
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():

    try:

        db.command('ping')
        return jsonify({
            'status': 'healthy',
            'message': 'Registration API is running',
            'database': 'connected',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'message': 'Database connection failed',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

if __name__ == '__main__':
    print("Starting Registration API with MongoDB...")
    print("Available endpoints:")
    print("- POST /api/register - Register a new user")
    print("- GET /api/users - Get all users")
    print("- GET /api/users/<id> - Get user by ID")
    print("- POST /api/login - User login")
    print("- GET /api/health - Health check")
    print("\nMongoDB Configuration:")
    print(f"- URI: {MONGO_URI}")
    print(f"- Database: registration_db")
    print(f"- Collection: users")

    app.run(debug=True, host='localhost', port=5001)
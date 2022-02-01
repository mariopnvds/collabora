from operator import and_
import os
import flask
import flask_sqlalchemy
import flask_praetorian
import flask_cors
import flask_mail
from sqlalchemy.orm import relationship
from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.ext.serializer import loads, dumps

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()
mail = flask_mail.Mail()

with open('./templates/registration_email_template.html', 'r') as f:
    registration_template = f.read()

with open('./templates/reset_email_template.html', 'r') as f2:
    reset_template = f2.read()

# A generic user model that might be used by an app powered by flask-praetorian
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=False, server_default='false')
    country=db.Column(db.Text)
    city=db.Column(db.Text)
    zip=db.Column(db.Text)
    microtasks = relationship('Microtask')

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def lookup(cls, email):
        return cls.query.filter_by(email=email).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active

# A generic microtask model that might be used by an app powered by flask-praetorian
class Microtask(db.Model):
    __tablename__ = "microtask"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    type = db.Column(db.Text)
    goal = db.Column(db.Integer)
    email = db.Column(db.Text)
    description = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    country = db.Column(db.Text)
    city = db.Column(db.Text)
    zip = db.Column(db.Integer)
    user_id = db.Column(db.Integer, ForeignKey('user.email'))
    completed = db.Column(db.Integer)
    values = relationship('Values')

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active

# A generic values model that might be used by an app powered by flask-praetorian
class Values(db.Model):
    __tablename__ = "value"
    id = db.Column(db.Integer, primary_key=True)
    measurement = db.Column(db.Text)
    date = db.Column(db.Date)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    microtask_id = db.Column(db.Integer, ForeignKey('microtask.id'))   

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active

# Initialize flask app for the example
app = flask.Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
app.config["PRAETORIAN_CONFIRMATION_SENDER"] = 'o.innocait@gmail.com'
app.config["PRAETORIAN_RESET_SENDER"] = 'o.innocait@gmail.com'
app.config["PRAETORIAN_CONFIRMATION_SUBJECT"] = "Confirmation email for COLLABORA"
app.config["PRAETORIAN_CONFIRMATION_URI"] = "http://localhost:3000/finalize"
app.config["PRAETORIAN_RESET_URI"] = "http://localhost:3000/reset_email"


# Mail Config
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'o.innocait@gmail.com'
app.config['MAIL_PASSWORD'] = 'Venalcait.1'
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']

# Add the mail extension if MAIL_SERVER is set
if app.config.get("MAIL_SERVER"):
    mail.init_app(app)

# Initialize the flask-praetorian instance for the app
guard.init_app(app, User)

# Initialize a local database for the example
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.getcwd(), 'database.db')}"
db.init_app(app)

# Initializes CORS so that the api_tool can talk to the example app
cors.init_app(app)

# Add users for the example
with app.app_context():
    db.create_all()
    if db.session.query(User).filter_by(username='mario').count() < 1:
        db.session.add(User(
          username='mario',
          email='m.penavades@gmail.com',
          password=guard.hash_password('pass'),
          roles='admin',
          is_active=1,
          country="United States",
          city="Chicago",
          zip="60613"
		))
    db.session.commit()


# Set up some routes for the example
@app.route('/api/')
def home():
  	return {"Hello": "World"}, 200


@app.route('/api/register', methods=['POST'])
def register():
    """
    Registers a new user by parsing a POST request containing new user info and
    dispatching an email with a registration token
    .. example::
       $ curl http://localhost:5000/api/register -X POST \
         -d '{
           "username":"mario", \
           "password":"pass", \
           "email":"m.penavades@gmail.com" \
         }'
    """
    req = flask.request.get_json(force=True)
    username = req.get('username', None)
    email = req.get('email', None)
    password = req.get('password', None)
    country = req.get('country', None)
    city = req.get('city', None)
    zip = req.get('zip', None)
    new_user = User(
        username=username,
        password=guard.hash_password(password),
        email=email,
        roles='user',
        country=country,
        city=city,
        zip=zip
    )
    db.session.add(new_user)
    db.session.commit()
    guard.send_registration_email(email, user=new_user, template=registration_template)
    ret = {'message': 'successfully sent registration email to user {}'.format(
        new_user.username
    )}
    return (flask.jsonify(ret), 201)


@app.route('/api/finalize')
def finalize():
    """
    Finalizes a user registration with the token that they were issued in their
    registration email
    .. example::
       $ curl http://localhost:5000/api/finalize -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    try:
        registration_token = guard.read_token_from_header()
    except Exception as err:
        print(f"Couldn't extract token from header: {str(err)}")
        raise
    user = guard.get_user_from_registration_token(registration_token)
    db.session.query(User).filter_by(username=user.username).update({"is_active": 1})
    db.session.commit()
    ret = {'access_token': guard.encode_jwt_token(user)}
    return (flask.jsonify(ret), 200)


@app.route('/api/login', methods=['POST'])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST \
         -d '{"username":"mario","password":"pass"}'
    """
    req = flask.request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    return ret, 200


## TO-DO (Don't know if it is implemented or it is not.)
@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/api/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    old_token = flask.request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200


@app.route('/api/reset_email', methods=['POST'])
def reset():
    try:
        req = flask.request.get_json(force=True)
        email = req.get('email', None)
        notify = guard.send_reset_email(email, template=reset_template)
        ret = {'message': 'password reset email sent for {}'.format(email)}
        return ret
    except Exception as e:
        ret = {'message': 'failed to reset user',
            'errors': repr(e)}
        return ret


@app.route('/api/confirm_reset', methods=['POST'])
def confirm_reset():
    req = flask.request.get_json(force=True)
    try:
        if(req['token']==""):
            username = req.get('username', None)
            email = req.get('email', None)
            password = req.get('old_pass', None)
            token = guard.encode_jwt_token(guard.authenticate(email, password))
            if token!="":
                db.session.query(User).filter_by(username=username).update({"password": guard.hash_password(req['new_pass'])})
        else:
            user = guard.validate_reset_token(req['token'])
            db.session.query(User).filter_by(username=user.username).update({"password": guard.hash_password(req['new_pass'])})
        db.session.commit()
        ret = {'message': 'password reset good'}
        return flask.jsonify(ret, 200)
    except Exception as e:
        return flask.jsonify("error", "error using that token")


@app.route('/api/profile')
@flask_praetorian.auth_required
def profile():
    msg = {
            "username": f'{flask_praetorian.current_user().username}',
            "email": f'{flask_praetorian.current_user().email}',
            "role": f'{flask_praetorian.current_user().roles}'
        }
    return flask.jsonify(msg)


@app.route('/api/remove', methods=['POST'])
def remove():
    """
    Disables a user in the data store
    .. example::
        $ curl http://localhost:5000/api/remove -X POST \
          -d '{"username":"Walter"}'
    """
    req = flask.request.get_json(force=True)

    username = req.get('username', None)
    password = req.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    if(user and ret):
        User.query.filter_by(username=username).delete()
        db.session.commit()
    return flask.jsonify(message="user {} deleted".format(user.username)), 200


@app.route('/api/remove_admin', methods=['POST'])
def remove_admin():
    """
    Disables a user in the data store
    .. example::
        $ curl http://localhost:5000/api/remove -X POST \
          -d '{"username":"Walter"}'
    """
    req = flask.request.get_json(force=True)
    username = req.get('username', None)
    if(username):
        User.query.filter_by(username=username).delete()
        db.session.commit()
    return flask.jsonify(message="user {} deleted".format(username)), 200


@app.route('/api/create_task', methods=['POST'])
@flask_praetorian.roles_required("admin")
@flask_praetorian.auth_required
def create_task():
    """
    Registers a new microtask by parsing a POST request containing new microstask info
    """
    req = flask.request.get_json(force=True)
    title = req.get('title', None)
    type = req.get('type', None)
    goal = req.get('goal', None)
    email = req.get('email', None)
    description = req.get('description', None)
    latitude = req.get('latitude', None)
    longitude = req.get('longitude', None)
    country = req.get('country', None)
    city = req.get('city', None)
    zip = req.get('zip', None)
    new_microtask = Microtask(
        title = title,
        type = type,
        goal = goal,
        email = email,
        description = description,
        latitude = latitude,
        longitude = longitude,
        country = country,
        city = city,
        zip = zip, 
        completed = 0,
        user_id = email
    )
    db.session.add(new_microtask)
    db.session.commit()
    ret = {'message': 'successfully microtask created {}'.format(
        new_microtask.title
    )}
    print(ret)
    return (flask.jsonify(ret), 201)


@app.route('/api/campaigns', methods=['POST'])
@flask_praetorian.auth_required
def microtasks():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       
    """
    req = flask.request.get_json(force=True)
    username = req.get('username', None)
    campaigns = Microtask.query.filter_by(user_id=username)
    all_campaigns = []
    for campaign in campaigns:
        all_campaigns.append({"title": campaign.title, "type": campaign.type, "goal": campaign.goal, "description": campaign.description, "country": campaign.country, "city": campaign.city, "zip": campaign.zip, "completed": f"{campaign.completed}", "id": campaign.id})
    return {"message": f"{all_campaigns}"}

@app.route('/api/accept_campaign', methods=['POST'])
@flask_praetorian.auth_required
def accept_microtask():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       
    """
    req = flask.request.get_json(force=True)
    username = req.get('username', None)
    id = req.get('id', None)
    db.session.query(Microtask).filter_by(id=id).filter_by(user_id=username).update({"completed": 1})
    db.session.commit()
    return {"message": f"Campaign accepted"}


@app.route('/api/users')
@flask_praetorian.roles_required("admin")
@flask_praetorian.auth_required
def users():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/api/users -X GET
    """
    users = User.query.all()
    all_users = []
    for user in users:
        all_users.append({"username": user.username, "email": user.email, "role": user.roles,"is_active": f"{user.is_active}","country": f"{user.country}","city": f"{user.city}","zip": f"{user.zip}"})
    return {"message": f"{all_users}"}


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    print("Hello from catch all")
    if path != "" and os.path.exists(os.path.join('..','build',path)):
        return app.send_static_file(path)
    else:
        return app.send_static_file('index.html')


# Run the example
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
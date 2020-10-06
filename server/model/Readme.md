export FLASK_APP=productmodel.py
flask db init
flask db migrate
flask db upgrade
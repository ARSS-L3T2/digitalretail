# set base image (host OS)
FROM python:3.8

WORKDIR /app
COPY . /app
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
ENV STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

EXPOSE 5000

# command to run on container start
CMD export ENV FLASK_APP="server/app.py" && flask run --host 0.0.0.0
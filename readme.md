test7

**To start using this**

1) cd to server folder and export the below  

 - export STRIPE_PUBLISHABLE_KEY=xxx
 - export STRIPE_SECRET_KEY=xxx

2) FLASK_APP=app.py FLASK_ENV=development flask run --cert=adhoc

**run docker image**

docker run -d -t -i -e STRIPE_PUBLISHABLE_KEY='xxx' -e STRIPE_SECRET_KEY='xxx' -p 5000:5000 <<docker_image>>

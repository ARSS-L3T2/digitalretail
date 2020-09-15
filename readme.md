
**To start using**

1) cd to server folder and export the below  

 - export STRIPE_PUBLISHABLE_KEY=pk_test_Hl0hejzTiQ4JVdWcQOcF9XAE00u6tj2b3p
 - export STRIPE_SECRET_KEY=sk_test_hPh9KZpa3JXBTiWABRLpTOHM00mUtR7qI5

2) FLASK_APP=app.py FLASK_ENV=development flask run --cert=adhoc

**run docker image**

docker run -d -t -i -e STRIPE_PUBLISHABLE_KEY='pk_test_Hl0hejzTiQ4JVdWcQOcF9XAE00u6tj2b3p' -e STRIPE_SECRET_KEY='sk_test_hPh9KZpa3JXBTiWABRLpTOHM00mUtR7qI5' -p 5000:5000 <<docker_image>>
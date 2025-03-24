sudo apt update && sudo apt install -y nodejs npm

sudo npm install -g pm2

pm2 stop myapp

cp /home/ubuntu/privatekey.pem SimpleApplication/privatekey.pem
cp /home/ubuntu/server.crt SimpleApplication/server.crt

cd Myapp/

npm install 

pm2 start .bin/www --name myapp 







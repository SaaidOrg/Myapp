sudo apt update 

sudo apt install nodejs npm

sudo npm install -g pm2

pm2 stop myapp

cp /home/ubuntu/privatekey.pem Myapp/privatekey.pem
cp /home/ubuntu/server.crt Myapp/server.crt


cd Myapp/

npm install 

pm2 start .bin/www --name myapp 





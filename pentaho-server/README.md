####################################
#            DOCKER                #
####################################
#Docker file >>Build>> Image >>Run>> Container
####################################
#       PENTAHO-SERVER.TAR         #
####################################
#first create the pentaho-server.tar
#from the support portal, download the archive install zip and run the install.sh/bat locally to get the actual content
#only tar the pentaho-server folder, no need for license-installer or jdbc-distribution
#put the pentaho-server.tar in the pentaho-docker-withoutenv folder

####################################
#       DOCKER VIRTUAL NETWORK     #
####################################
# Creating a virtual network for Pentaho and the Postgre DB
# Replace <pentaho-postgres-virtualnetwork> by the name you want
docker network create pentaho-postgres-virtualnetwork

####################################
#       POSTGRES DEPLOYMENT        #
####################################
# Inside the postgres-docker folder
# You first need to build the image
# you need to give you image a name, usually "yourdockeraccount/name"
docker build --rm -t bepperaymaekers/postgresql .

# Run the postgres container from the image, this creates a default DB with user, so that Pentaho can later add the other DBs (jackrabbit, ...)
docker run --name postgresql -p 5433:5432 -d -e 'POSTGRES_USER=pentaho' -e 'POSTGRES_PASSWORD=password' -e 'POSTGRES_DB=pentaho' --net pentaho-postgres-virtualnetwork bepperaymaekers/postgresql

####################################
#       PENTAHO DEPLOYMENT         #
####################################
#Inside the pentaho-docker folder (cd pentaho-docker)
#You need to build the images only once or if you change the Dockerfile or any other content in the folder
docker build --rm -t bepperaymaekers/pentaho-83 .
#Run the pentaho container, exposing it on localhost 8083, this uses the default variable values defined in the dockerfile
docker run -d -p 8083:8080 --name pentaho83 -e 'PG_DB=pentaho' -e 'DB_USER=pentaho' --net pentaho-postgres-virtualnetwork bepperaymaekers/pentaho-83
docker run -d -p 8083:8080 --name pentaho83 --net pentaho-postgres-virtualnetwork bepperaymaekers/pentaho-83
#if you want to run with variable replacement add eg. -e 'PENTAHO_HOME=/opt/pentaho' -e 'PG_PORT=5433'
docker run -d -p 8083:8080 --name pentaho83 -e 'PG_HOST=postgresql' -e 'PG_PORT=5432' --net pentaho-postgres-virtualnetwork bepperaymaekers/pentaho-83

###Optional, to push your image to docker hub
docker commit * senechalm/op-pentaho
docker tag senechalm/op-pentaho senechalm/op-pentaho
docker push senechalm/op-pentaho

################################################################################################################

#OPTIONAL (for debugging)

#List all the containers with a status
docker ps -a

#Stop a container
docker stop $ID
#Remove a container (need to be stopped before)
docker container rm $ID
#Start a container
docker start $ID

#View logs of a container
docker logs $ID
#View logs of a container (Realtime)
docker logs -f $ID

#List images
docker images
#Remove an image
docker image rm $ID

#connect to container and look Inside
docker exec -it $ID /bin/bash
#exit
exit

#remove all idle containers, eg. if you want to start a new container with the same name he would not do it unless you prune, if you stop the container is not gone, you can restart it
docker container prune

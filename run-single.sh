# Build the single container image
docker build -f Dockerfile.single -t triptactix .

# Run the container with environment variables from .env file
docker run -d \
  --name triptactix \
  --network host \
  --env-file server/.env \
  triptactix

# View logs
docker logs -f triptactix

# Stop and remove
# docker stop triptactix && docker rm triptactix
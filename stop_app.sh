#!/bin/bash

echo "Deteniendo contenedores del Gym Tracker..."
docker-compose stop

echo "Respaldando logs generados en AWS S3..."
# Obtenemos el número de cuenta de AWS para saber el nombre exacto de tu bucket
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="gym-tracker-logs-$ACCOUNT_ID"

aws s3 cp ./logs/app.log s3://$BUCKET_NAME/app_log_$(date +%F_%H-%M-%S).log

echo "¡Aplicación detenida y logs respaldados correctamente en S3!"
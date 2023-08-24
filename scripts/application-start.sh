#!/bin/bash

DIR="/home/ec2-user/phishbusters-api"
sudo chmod -R 777 ${DIR}
cd ${DIR}

# add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Ruta del archivo .env
ENV_FILE="${DIR}/.env"

# Si el archivo .env ya existe, vaciar su contenido
if [ -f "$ENV_FILE" ]; then
    > "$ENV_FILE"  # Vaciar el contenido del archivo
else
    touch "$ENV_FILE"  # Crear el archivo si no existe
fi


# Obtener y agregar las variables de entorno desde SSM Parameter Store
PARAMETER_NAMES=$(aws ssm describe-parameters --query "Parameters[].Name" --output text)
for PARAMETER_NAME in $PARAMETER_NAMES; do
    PARAMETER_VALUE=$(aws ssm get-parameter --name "$PARAMETER_NAME" --with-decryption --query "Parameter.Value" --output text)
    
    # Agregar variables de entorno al archivo .env
    echo "$PARAMETER_NAME=$PARAMETER_VALUE" >> "$ENV_FILE"
done

nohup npm run ci:start > /dev/null 2>&1 &
disown
FROM node:21-alpine

ENV NODE_ENV=production
ENV INPUT_FILE=/workspace/.env
ENV OUTPUT_FILE=/workspace/.env.yaml

WORKDIR /app

COPY env2yaml.cjs .

ENTRYPOINT node env2yaml.cjs $INPUT_FILE $OUTPUT_FILE
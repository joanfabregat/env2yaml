# env2yaml

Docker container for conversion of env files to YAML files to be used with Google Cloud Run gcloud CLI. It is in particular design to be used with GitHub Actions et Google Cloud Build to deploy applications to Google Cloud Run.

This container is loosely based after [this shell script](https://gist.github.com/l2D/51389881160b2bb9fdafc75277186b84) by [l2D](https://gist.github.com/l2D).

The container is available on [Docker Hub](https://hub.docker.com/r/joanfabregat/env2yaml) under the name `joanfabregat/env2yaml`.

## Usage

As a standalone script:
```bash
curl -L -o env2yaml.sh https://raw.githubusercontent.com/joanfabregat/env2yaml/main/env2yaml.cjs 
node env2yaml.sh .env env.yaml
```

In a [`cloudbuild.yaml`](https://cloud.google.com/build/docs/build-config-file-schema) configuration file:
```yaml
steps:
  # Build the container image
  - id: 'docker-build'
    name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '.'

  # Generation of the env.yaml file
  - id: 'env2yaml'
    name: 'joanfabregat/env2yaml'
    env:
      - 'INPUT_FILE=/workspace/.env'
      - 'OUTPUT_FILE=/workspace/.env.yaml'

  # Deploy container image to Cloud Run
  - id: 'deploy-to-cloudrun-staging'
    name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    args:
      - 'run'
      - 'deploy'
      - '--env-vars-file=/workspace/.env.yaml'
```
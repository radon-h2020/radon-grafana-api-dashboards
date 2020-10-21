# grafana_api

Grafana api automates the process of create and delete a grafana dashboard.Dashboards can be viewed by user only.
There are 3 types of dashboards that supported at that moment

- Container Monitoring Dashboards
-- Monitor cpu,ram,networking of containers
- Custom
-- Monitor the CPU and RAM of serverless functions
- AWS cloudwatch
-- Visualize metrics from AWS Cloudwatch

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install dependencies and run the API.

```bash
npm i
npm run start
```

Set up .env

```
GRAFANA_URL='Grafana server url'
GRAFANA_API_KEY='<API_KEY>'
GRAFANA_ADMIN_USERNAME='<ADMIN_USERNAME>'
GRAFANA_ADMIN_PASSWORD='<ADMIN_PASSWORD>'
PORT="<API_PORT>"
```
If you do not specify port, the API will run at 3100.
## Usage

Create Custom dashboard

```CURL
curl  -X POST 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "custom"
}'

```

Create container monitoring dashboard
```CURL
curl  -X POST 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "docker"
}'

```

Create aws cloudwatch monitoring dashboard

```CURL
curl -X POST 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "awsLambda",
    "keys": {
        "accessKey": "<accessKey>",
        "secretKey": "<secretKey>"
    }
}'
```




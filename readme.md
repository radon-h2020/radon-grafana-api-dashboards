
# grafana monitoring api

> Monitoring repository for the [RADON project](http://radon-h2020.eu) 
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[![RADON on Twitter](https://img.shields.io/twitter/url/https/twitter.com/RADON_2020?label=RADON%20on%20Twitter&style=social)](https://twitter.com/RADON_2020)

Grafana api automates the process of create and delete a grafana dashboard and alerts. There are 3 types of dashboards that supported at that moment

- Container Monitoring Dashboards
-- Monitor cpu, ram, networking of containers
- Custom
-- Monitor the CPU and RAM of serverless functions
- AWS cloudwatch
-- Visualize metrics from AWS Cloudwatch

## Preparation
Set up grafana API key.

![enter image description here](https://i.ibb.co/8jHrpjc/apikey-create.png)
 
Set up notification channel
![enter image description here](https://i.ibb.co/nkhRvpx/create-notification-channer-1.png)

![enter image description here](https://i.ibb.co/YQ7vrLJ/create-notification-channer-2.png)

## Installation

### NPM
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
PROM_DS_NAME='Name_Of_Datasource'
```
If you do not specify port, the API will run at 3100.

### Docker

    docker build -t grafana_api .
    docker run --name graphana_api --env-file env_file -p <PORT>:3100 grafana_api

## Usage
### Alerting
When an insindent occurs grafana_api will send a payload to the given url (payload URL) that contains insident's details .

```
{
	"jobID": <ID_OF_JOB>,
	"alertType": <RAM || CPU>,
	"scale": <ScaleUP || ScaleDown>
}
```

### Custom Dashboards
 **Create Custom dashboard without alert mechanism**

```CURL
curl  -X POST 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "custom"
}'

```

**Create custom dashboard with alerting**
Send alert to xOPERA (callbackURL) when CPU or RAM surpass a limit. CPU is % and RAM is on MB.
```CURL
curl  -X POST 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "custom",
    "cpuAlertThreshold": 50,
    "ramAlertThreshold": 900,
    "callbackURL": "http://URL"
}'
```
**Create custom dashboard with downscale alert** 
Send alert to xOPERA (callbackURL) when CPU or RAM are below the limit
```CURL
curl  -X POST 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "custom",
    "cpuDownScaleThreshold": 50,
    "ramDownScaleThreshold": 900,
     callbackURL": "http://URL"

}'
```
**Create custom dashboard with downscale and upscale alert**

```CURL
curl  -X POST 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "custom",
    "cpuAlertThreshold": 80,
    "ramAlertThreshold": 2000,
    "cpuDownScaleThreshold": 20,
    "ramDownScaleThreshold": 900,
     callbackURL": "http://URL"

}'
```

### Container monitoring dashboard

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

### Create aws cloudwatch monitoring dashboard

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
### Add/Edit Alert into existing APP

```CURL
curl  -X POST 'localhost:3100/alert' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
    "type": "custom",
    "cpuAlertThreshold": 80, #(OPTIONAL)
    "ramAlertThreshold": 2000, #(OPTIONAL)
    "cpuDownScaleThreshold": 20, #(OPTIONAL)
    "ramDownScaleThreshold": 900, #(OPTIONAL)
     callbackURL": "http://URL" #(Mandatory if an alert have been setted up)

}'
```

### Delete Monitoring 

```CURL
curl  -X DELETE 'localhost:3100/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "mail@mail.com",
    "jobid": "jobid",
}'
```


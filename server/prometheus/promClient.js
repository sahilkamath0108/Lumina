import client from 'prom-client'
import { register } from 'prom-client';

const metric_label_enum = {
    PATH: "path",
    METHOD: "method",
    STATUS_CODE: "status_code",
};

// * The http_request counter for measuring the total no of requests made to the application
const http_request_total = new client.Counter({
    name: "node_http_request_total",
    help: "The total number of HTTP requests received",
    labelNames: [
        metric_label_enum.PATH,
        metric_label_enum.METHOD,
        metric_label_enum.STATUS_CODE,
    ],
});

client.collectDefaultMetrics(
    {
        register: register,
        prefix: "lumina_",
        timeout: 5000
    }
);
// * Registers the HTTP request counter metric
register.registerMetric(http_request_total);

// * The http_response rate histogram for measuring the response rates for each http request
const http_response_rate_histogram = new client.Histogram({
    name: "node_http_duration",
    labelNames: [
        metric_label_enum.PATH,
        metric_label_enum.METHOD,
        metric_label_enum.STATUS_CODE,
    ],
    help: "The duration of HTTP requests in seconds",
    buckets: [
        0.0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3,
        1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 10
    ],
});

// * Registers the HTTP response rate metric
register.registerMetric(http_response_rate_histogram);

// * The node_js memory guage for measuring the memory of the application in use
const nodejs_memory = new client.Gauge({
    name: "node_memory_usage_bytes",
    help: "Current memory usage of the Node.js process in bytes",
});

register.registerMetric(nodejs_memory);

const nodejs_cpu_usage = new client.Gauge({
    name: "node_cpu_usage_percent",
    help: "CPU utilization of the Node.js process in percentage",
});

// * Registers the Node Js cpu usage guage metric
register.registerMetric(nodejs_cpu_usage);

export {
  register,
  http_request_total,
  http_response_rate_histogram,
  nodejs_memory,
  nodejs_cpu_usage,
};





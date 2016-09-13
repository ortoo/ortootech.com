#!/usr/bin/env bash

# Replace <<PORT>> in the config file with the actual port
sed "s/{{PORT}}/${PORT}/g" /etc/nginx/nginx.conf > /etc/nginx/nginx.processed.conf

exec "$@"

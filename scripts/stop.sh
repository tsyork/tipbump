#!/bin/sh

[[ -e /etc/init/novum-app.conf ]] \
  && status novum-app | \
    grep -q '^novum-app start/running, process' \
  && [[ $? -eq 0 ]] \
  && stop novum-app || echo "Application not started"
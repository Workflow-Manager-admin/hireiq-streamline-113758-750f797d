#!/bin/bash
cd /home/kavia/workspace/code-generation/hireiq-streamline-113758-750f797d/hireiq_web_frontend_workspace/hireiq_web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


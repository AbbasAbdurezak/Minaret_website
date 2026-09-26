#!/bin/sh
set -e

# Ensure data and uploads directories exist
mkdir -p /app/data /app/public/uploads

# Ensure proper permissions for nextjs user (uid:gid 1001:1001) on mounted volumes
chown -R nextjs:nodejs /app/data /app/public/uploads

# Execute command as nextjs user
exec su-exec nextjs "$@"

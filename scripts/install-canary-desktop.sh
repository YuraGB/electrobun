#!/usr/bin/env bash

set -e

APP_NAME="react-tailwind-vite-canary"
APP_DIR="$HOME/Projects/elektrobun/TodoList/.release/$APP_NAME"
DESKTOP_DIR="$HOME/.local/share/applications"
DESKTOP_FILE="$DESKTOP_DIR/$APP_NAME.desktop"

mkdir -p "$DESKTOP_DIR"

cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=react-tailwind-vite (Canary)
Comment=react-tailwind-vite application
Exec=$APP_DIR/bin/launcher
Icon=$APP_DIR/Resources/appIcon.png
Terminal=false
StartupWMClass=react-tailwind-vite-canary-canary
Categories=Utility;
EOF

chmod +x "$APP_DIR/bin/launcher"

update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true

echo "Installed: $DESKTOP_FILE"

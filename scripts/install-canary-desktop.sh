#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(find .release -mindepth 1 -maxdepth 1 -type d | head -n1)"

LAUNCHER="$APP_DIR/bin/launcher"
ICON="$APP_DIR/Resources/appIcon.png"
DESKTOP_ID="$(basename "$APP_DIR")"
DESKTOP_DIR="$HOME/.local/share/applications"

WM_CLASS="$("$LAUNCHER" --wm-class 2>/dev/null || echo "$DESKTOP_ID")"

mkdir -p "$DESKTOP_DIR"

cat > "$DESKTOP_DIR/$DESKTOP_ID.desktop" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=$DESKTOP_ID
Exec=$LAUNCHER
Icon=$ICON
Terminal=false
StartupWMClass=$WM_CLASS
Categories=Utility;
EOF

update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
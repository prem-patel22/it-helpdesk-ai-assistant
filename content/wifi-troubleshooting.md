# WiFi Connection Troubleshooting

## Can't connect to WiFi

### Fix 1: Toggle WiFi off and on
1. Click WiFi icon in taskbar
2. Turn WiFi OFF
3. Wait 10 seconds
4. Turn WiFi ON

### Fix 2: Forget and reconnect
1. Click WiFi icon
2. Right-click your network
3. Select "Forget"
4. Reconnect and enter password

### Fix 3: Run network troubleshooter
1. Settings → Network & Internet
2. Click "Network troubleshooter"
3. Follow instructions

### Fix 4: Reset network settings
1. Open Command Prompt as Admin
2. Type: netsh winsock reset
3. Type: netsh int ip reset
4. Restart computer

## WiFi connected but no internet
1. Open Command Prompt
2. Type: ipconfig /release
3. Type: ipconfig /renew
4. Type: ipconfig /flushdns
5. Restart computer
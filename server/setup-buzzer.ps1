<#
  setup-buzzer.ps1 — One-time Windows setup so phones can reach the buzzer.

  buzzer-server.ps1 runs this automatically (as administrator) the
  first time. It does two things:
    1. lets the server listen for other devices on port 8080
    2. adds a Windows Firewall rule allowing phones to connect on that port

  To undo it later, run these in an administrator PowerShell:
    netsh http delete urlacl url=http://+:8080/
    netsh advfirewall firewall delete rule name="Trivia Night Buzzer"
#>
param(
  [int]$Port = 8080
)

Write-Host "Setting up the PANALO! buzzer on port $Port..." -ForegroundColor Cyan

# 1. Allow the server to listen on this port without being administrator
#    (D:(A;;GX;;;WD) = everyone on this computer may use it)
netsh http delete urlacl url="http://+:$Port/" | Out-Null
netsh http add urlacl url="http://+:$Port/" sddl="D:(A;;GX;;;WD)"

# 2. Let phones on the Wi-Fi through the firewall on this port
netsh advfirewall firewall delete rule name="Trivia Night Buzzer" | Out-Null
netsh advfirewall firewall add rule name="Trivia Night Buzzer" dir=in action=allow protocol=TCP localport=$Port

Write-Host "Done! This window will close." -ForegroundColor Green
Start-Sleep -Seconds 2

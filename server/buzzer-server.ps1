<#
  =========================================================
  buzzer-server.ps1 — The Trivia Night buzzer server.

  Start it by double-clicking "Start Buzzer.bat" in the main
  project folder. It:
    - serves the game to this laptop at   http://localhost:8080
    - serves the buzzer to phones at      http://<this laptop's Wi-Fi address>:8080/buzz
    - remembers who buzzed first and locks everyone else out
      until the host clicks "Unlock buzzers" in the game

  Phones must be on the SAME Wi-Fi as this laptop.
  Close this window (or press Ctrl+C) to stop the server.

  The first time, Windows needs permission for phones to connect.
  If it isn't set up yet, this script asks for administrator
  permission once and runs setup-buzzer.ps1 for you.
  =========================================================
#>
param(
  [int]$Port = 8080,
  [switch]$LocalOnly,   # this laptop only (no phones) - handy for testing
  [switch]$NoBrowser    # don't open the game automatically
)

$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

# ---------------------------------------------------------
# Buzzer state
# ---------------------------------------------------------
$state = @{
  locked = $false
  winner = $null   # @{ id; name; color } of the team that buzzed first
  buzzId = 0       # goes up every time someone buzzes or the host unlocks
  teams  = @()     # sent by the game: @( @{ id; name; color }, ... )
}
$lastSeenPlayers = @{}   # phone id -> when it last checked in
$PlayerTimeoutSeconds = 6

# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

# This laptop's Wi-Fi / network addresses, e.g. 192.168.1.20
function Get-LanAddresses {
  $addresses = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
    Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork } |
    ForEach-Object { $_.IPAddressToString } |
    Where-Object { $_ -match '^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)' }
  # Home Wi-Fi is usually 192.168.x.x; 172.x.x.x is often a virtual adapter, so list it last
  $ordered = @($addresses | Sort-Object { if ($_ -like "192.168.*") { 0 } elseif ($_ -like "10.*") { 1 } else { 2 } })
  return @($ordered | Select-Object -Unique)
}

function Get-JoinUrls {
  if (-not $script:lanReady) { return @() }
  return @(Get-LanAddresses | ForEach-Object { "http://${_}:$Port/buzz" })
}

function Get-PlayerCount {
  $cutoff = (Get-Date).AddSeconds(-$PlayerTimeoutSeconds)
  return @($lastSeenPlayers.Values | Where-Object { $_ -gt $cutoff }).Count
}

function Get-PublicState {
  return @{
    locked   = $state.locked
    winner   = $state.winner
    buzzId   = $state.buzzId
    teams    = @($state.teams)
    players  = Get-PlayerCount
    joinUrls = @(Get-JoinUrls)
  }
}

function Send-Bytes($context, [byte[]]$bytes, [string]$contentType, [int]$status = 200) {
  $response = $context.Response
  $response.StatusCode = $status
  $response.ContentType = $contentType
  $response.Headers["Cache-Control"] = "no-store"
  $response.ContentLength64 = $bytes.Length
  $response.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Send-Json($context, $data, [int]$status = 200) {
  $json = ConvertTo-Json -InputObject $data -Depth 6 -Compress
  Send-Bytes $context ([System.Text.Encoding]::UTF8.GetBytes($json)) "application/json; charset=utf-8" $status
}

function Send-Text($context, [string]$text, [int]$status) {
  Send-Bytes $context ([System.Text.Encoding]::UTF8.GetBytes($text)) "text/plain; charset=utf-8" $status
}

function Read-JsonBody($context) {
  $reader = New-Object System.IO.StreamReader($context.Request.InputStream, [System.Text.Encoding]::UTF8)
  $body = $reader.ReadToEnd()
  $reader.Close()
  if (-not $body) { return $null }
  return ConvertFrom-Json $body
}

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif"  = "image/gif"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".json" = "application/json; charset=utf-8"
  ".mp3"  = "audio/mpeg"
  ".woff2" = "font/woff2"
}

# Serves a file from the project folder (never anything outside it)
function Send-ProjectFile($context, [string]$urlPath) {
  $relative = [Uri]::UnescapeDataString($urlPath.TrimStart('/'))
  if ($relative -eq "") { $relative = "index.html" }
  if ($relative -eq "buzz" -or $relative -eq "buzz/") { $relative = "buzzer/index.html" }

  # Don't serve hidden files (like .git) or the server scripts
  if ($relative -match '(^|/)\.' -or $relative -like "server/*") {
    Send-Text $context "Not found" 404; return
  }

  $fullPath = [System.IO.Path]::GetFullPath((Join-Path $ProjectRoot $relative))
  $insideProject = $fullPath.StartsWith($ProjectRoot + [System.IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)

  if (-not $insideProject -or -not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
    Send-Text $context "Not found" 404; return
  }

  $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
  $contentType = if ($MimeTypes.ContainsKey($extension)) { $MimeTypes[$extension] } else { "application/octet-stream" }
  Send-Bytes $context ([System.IO.File]::ReadAllBytes($fullPath)) $contentType
}

# ---------------------------------------------------------
# Requests
# ---------------------------------------------------------
function Handle-Request($context) {
  $request = $context.Request
  $path = $request.Url.AbsolutePath
  $method = $request.HttpMethod

  # Phones say who they are when they check in, so we can count them
  $playerId = $request.QueryString["player"]
  if ($playerId) { $lastSeenPlayers[$playerId.Substring(0, [Math]::Min(40, $playerId.Length))] = Get-Date }

  # --- Everyone: current state -------------------------------------
  if ($path -eq "/api/state" -and $method -eq "GET") {
    Send-Json $context (Get-PublicState); return
  }

  # --- Phones: BUZZ! -------------------------------------------------
  if ($path -eq "/api/buzz" -and $method -eq "POST") {
    $body = Read-JsonBody $context
    $team = $state.teams | Where-Object { $_.id -eq $body.teamId } | Select-Object -First 1
    if (-not $team) { Send-Json $context @{ accepted = $false; reason = "unknown team" } 400; return }

    $accepted = $false
    if (-not $state.locked) {
      # First one in wins — requests are handled one at a time, so this is fair
      $state.locked = $true
      $state.winner = @{ id = $team.id; name = $team.name; color = $team.color }
      $state.buzzId = $state.buzzId + 1
      $accepted = $true
      Write-Host ("  BUZZ!  {0}   ({1})" -f $team.name, (Get-Date -Format "HH:mm:ss")) -ForegroundColor Yellow
    }
    Send-Json $context @{ accepted = $accepted; state = (Get-PublicState) }; return
  }

  # --- Host only (this laptop): unlock, and the team list ------------
  if ($path -eq "/api/unlock" -and $method -eq "POST") {
    if (-not $request.IsLocal) { Send-Text $context "Only the host can unlock" 403; return }
    if ($state.locked) {
      $state.locked = $false
      $state.winner = $null
      $state.buzzId = $state.buzzId + 1
    }
    Send-Json $context (Get-PublicState); return
  }

  if ($path -eq "/api/teams" -and $method -eq "POST") {
    if (-not $request.IsLocal) { Send-Text $context "Only the host can change teams" 403; return }
    $body = Read-JsonBody $context
    $state.teams = @($body | Select-Object -First 8 | ForEach-Object {
      @{
        id    = [string]$_.id
        name  = ([string]$_.name).Substring(0, [Math]::Min(24, ([string]$_.name).Length))
        color = if ([string]$_.color -match '^#[0-9a-fA-F]{6}$') { [string]$_.color } else { "#f4c76a" }
      }
    })
    Send-Json $context (Get-PublicState); return
  }

  # --- Everything else: files (the game, the buzzer page, images) ----
  if ($method -eq "GET") {
    Send-ProjectFile $context $path; return
  }

  Send-Text $context "Not found" 404
}

# ---------------------------------------------------------
# Start listening
# ---------------------------------------------------------
function New-Listener([string]$prefix) {
  $listener = New-Object System.Net.HttpListener
  $listener.Prefixes.Add($prefix)
  $listener.Start()
  return $listener
}

function Get-ListenerErrorCode($errorRecord) {
  $exception = $errorRecord.Exception
  while ($exception.InnerException) { $exception = $exception.InnerException }
  if ($exception -is [System.Net.HttpListenerException]) { return $exception.ErrorCode }
  return -1
}

$script:lanReady = $false
$listener = $null

try {
  if ($LocalOnly) {
    $listener = New-Listener "http://localhost:$Port/"
  } else {
    $listener = New-Listener "http://+:$Port/"
    $script:lanReady = $true
  }
} catch {
  $code = Get-ListenerErrorCode $_
  if ($code -eq 183 -or $code -eq 32) {
    Write-Host "Port $Port is already in use. Is the buzzer already running in another window?" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
  }

  # Access denied: Windows hasn't given permission for phones to connect yet
  Write-Host ""
  Write-Host "First-time setup: Windows needs your permission so phones can connect." -ForegroundColor Cyan
  Write-Host "Click YES on the popup that appears." -ForegroundColor Cyan
  try {
    $setupScript = Join-Path $PSScriptRoot "setup-buzzer.ps1"
    Start-Process powershell.exe -Verb RunAs -Wait -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$setupScript`" -Port $Port"
  } catch {
    Write-Host "Setup was cancelled." -ForegroundColor Yellow
  }

  try {
    $listener = New-Listener "http://+:$Port/"
    $script:lanReady = $true
  } catch {
    # Last resort: this laptop only (the game works, phones can't connect)
    $listener = New-Listener "http://localhost:$Port/"
    Write-Host ""
    Write-Host "Phones can't connect yet (setup didn't finish), but the game still works on this laptop." -ForegroundColor Yellow
  }
}

# ---------------------------------------------------------
# Running
# ---------------------------------------------------------
$hostUrl = "http://localhost:$Port/"
Write-Host ""
Write-Host "  ============================================" -ForegroundColor Magenta
Write-Host "   TRIVIA NIGHT BUZZER IS RUNNING" -ForegroundColor Yellow
Write-Host "  ============================================" -ForegroundColor Magenta
Write-Host "   Host (this laptop):  $hostUrl" -ForegroundColor White
foreach ($url in (Get-JoinUrls)) {
  Write-Host "   Players (phones):    $url" -ForegroundColor Green
}
if (-not $script:lanReady) {
  Write-Host "   Players: not available (see message above)" -ForegroundColor Yellow
} elseif ((Get-JoinUrls).Count -eq 0) {
  Write-Host "   Players: no Wi-Fi address found - is this laptop connected to Wi-Fi?" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "   Keep this window open during the game. Close it to stop." -ForegroundColor Gray
Write-Host ""

if (-not $NoBrowser) { Start-Process $hostUrl }   # open the game in the default browser

try {
  while ($listener.IsListening) {
    # Wait for the next request in short slices so Ctrl+C still works
    $pending = $listener.BeginGetContext($null, $null)
    while (-not $pending.AsyncWaitHandle.WaitOne(250)) { }
    $context = $listener.EndGetContext($pending)

    try {
      Handle-Request $context
    } catch {
      Write-Host "  Problem handling $($context.Request.Url.AbsolutePath): $($_.Exception.Message)" -ForegroundColor Red
      try { Send-Text $context "Server error" 500 } catch { }
    } finally {
      try { $context.Response.Close() } catch { }
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}

<#
  =========================================================
  buzzer-server.ps1 — The PANALO! buzzer server.

  Start it by double-clicking "Start Buzzer.bat" in the main
  project folder. It:
    - serves the game to this laptop at   http://localhost:8080
    - serves the buzzer to phones at      http://<this laptop's Wi-Fi address>:8080/buzz
    - only lets phones buzz while the game has a question up
    - remembers who buzzed first and locks everyone else out
      until the host clicks "Unlock buzzers" in the game
    - serves the HOST SCREEN at            http://<this laptop's Wi-Fi address>:8080/host
      It shows the host the open question AND its answer, so it
      needs the 4-digit host code printed in this window (a new
      code every time the server starts). Answers are never sent
      to the players' buzzers.

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
  open   = $false  # buzzers only work while the game has a question up
  locked = $false
  winner = $null   # @{ id; name; color } of the team that buzzed first
  buzzId = 0       # goes up every time someone buzzes or the host unlocks
  teams  = @()     # sent by the game: @( @{ id; name; color }, ... )
  blocked = @()    # ids of teams that already had their go at this question
}
$lastSeenPlayers = @{}   # phone id -> when it last checked in
$PlayerTimeoutSeconds = 6

# Host screen: the open question and its answer (sent by the game), kept
# out of the public state so players can never see the answer
$hostQuestion = $null
$HostCode = "{0:D4}" -f (Get-Random -Minimum 0 -Maximum 10000)

# Fast Money: the answering team plays on their phone. The server keeps the
# clock and the answers; answers only go back to the game (this laptop).
$fm = @{
  active    = $false
  teamIds   = @()   # the two teams playing, in turn order
  questions = @()   # question texts only (never the survey answers)
  seconds   = 45
  turnId    = 0     # goes up each time a turn starts
  turnTeamId = $null
  endsAt    = @{}   # teamId -> when their time runs out
  finished  = @{}   # teamId -> $true once their phone says they're done
  answerer  = $null # the phone answering for the current team
  answers   = @{}   # teamId -> @("answer 1", ..., "answer 5")
  taken     = @()   # per question: what the first team said (the second team can't repeat it)
}
$FastMoneyGraceSeconds = 3 # late answers still count for a moment (slow Wi-Fi)

# Final Wager: each team wagers on their phone. Amounts stay secret —
# phones only see WHO has locked in; the game (this laptop) reveals them.
$fw = @{
  active   = $false
  phase    = ""    # "wager" (phones can wager) → "question" / "reveal" (wagers locked)
  category = ""
  maxes    = @{}   # teamId -> the most that team may wager
  wagers   = @{}   # teamId -> amount
}

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

function Get-HostUrls {
  if (-not $script:lanReady) { return @() }
  return @(Get-LanAddresses | ForEach-Object { "http://${_}:$Port/host" })
}

function Get-PlayerCount {
  $cutoff = (Get-Date).AddSeconds(-$PlayerTimeoutSeconds)
  return @($lastSeenPlayers.Values | Where-Object { $_ -gt $cutoff }).Count
}

function Get-FastMoneyRemainingMs([string]$teamId) {
  if (-not $teamId -or -not $fm.endsAt.ContainsKey($teamId)) { return 0 }
  return [int][Math]::Max(0, ($fm.endsAt[$teamId] - (Get-Date)).TotalMilliseconds)
}

function Test-FastMoneyTeamDone([string]$teamId) {
  if (-not $fm.endsAt.ContainsKey($teamId)) { return $false }
  return [bool]$fm.finished[$teamId] -or (Get-FastMoneyRemainingMs $teamId) -eq 0
}

# What every phone may see: the clock and progress, never anyone's answers.
# Question texts are only included while a team is answering.
function Get-FastMoneyState {
  if (-not $fm.active) { return @{ active = $false } }
  $turnTeamId = $fm.turnTeamId
  $turnOver = if ($turnTeamId) { Test-FastMoneyTeamDone $turnTeamId } else { $true }
  $answered = if ($turnTeamId) { @($fm.answers[$turnTeamId] | Where-Object { $_ }).Count } else { 0 }
  return @{
    active      = $true
    teamIds     = @($fm.teamIds)
    seconds     = $fm.seconds
    turnId      = $fm.turnId
    turnTeamId  = $turnTeamId
    remainingMs = Get-FastMoneyRemainingMs $turnTeamId
    turnOver    = $turnOver
    answererId  = $fm.answerer
    answered    = $answered
    doneTeamIds = @($fm.teamIds | Where-Object { Test-FastMoneyTeamDone $_ })
    questions   = @(if (-not $turnOver) { $fm.questions })
    # Only while the second team is answering, so their phone can say "already said"
    taken       = @(if (-not $turnOver -and $turnTeamId -eq $fm.teamIds[1]) { $fm.taken })
  }
}

function Get-FinalWagerState {
  if (-not $fw.active) { return @{ active = $false } }
  return @{
    active        = $true
    phase         = $fw.phase
    category      = $fw.category
    maxes         = $fw.maxes
    lockedTeamIds = @($fw.wagers.Keys)
  }
}

function Get-PublicState {
  return @{
    open      = $state.open
    locked    = $state.locked
    winner    = $state.winner
    buzzId    = $state.buzzId
    teams     = @($state.teams)
    blocked   = @($state.blocked)
    players   = Get-PlayerCount
    joinUrls  = @(Get-JoinUrls)
    fastMoney = Get-FastMoneyState
    finalWager = Get-FinalWagerState
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
  if ($relative -eq "host" -or $relative -eq "host/") { $relative = "host/index.html" }

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
    if ($state.open -and -not $state.locked -and $state.blocked -notcontains $team.id) {
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
    # The game says whether a question is up, and which teams stay
    # locked out (they already guessed this question)
    $body = Read-JsonBody $context
    $state.open = [bool]($body -and $body.open)
    $state.blocked = @(if ($body -and $body.blocked) { $body.blocked | ForEach-Object { [string]$_ } })
    if ($state.locked) {
      $state.locked = $false
      $state.winner = $null
      $state.buzzId = $state.buzzId + 1
    }
    Send-Json $context (Get-PublicState); return
  }

  # The game tells us which question is open (null = back on the board)
  if ($path -eq "/api/question" -and $method -eq "POST") {
    if (-not $request.IsLocal) { Send-Text $context "Only the host can do that" 403; return }
    $script:hostQuestion = Read-JsonBody $context
    Send-Json $context @{ ok = $true }; return
  }

  # The game asks for the host screen address and code, to show them on the laptop
  if ($path -eq "/api/host-info" -and $method -eq "GET") {
    if (-not $request.IsLocal) { Send-Text $context "Only the host can do that" 403; return }
    Send-Json $context @{ code = $HostCode; urls = @(Get-HostUrls) }; return
  }

  # --- Final Wager ------------------------------------------------------
  if ($path -like "/api/fw/*" -and $path -ne "/api/fw/wager" -and -not $request.IsLocal) {
    Send-Text $context "Only the host can do that" 403; return
  }

  # The chosen category, and how much each team may wager
  if ($path -eq "/api/fw/setup" -and $method -eq "POST") {
    $body = Read-JsonBody $context
    $fw.active = $true
    $fw.phase = "wager"
    $fw.category = [string]$body.category
    $fw.maxes = @{}
    foreach ($property in $body.maxes.PSObject.Properties) { $fw.maxes[$property.Name] = [int]$property.Value }
    $fw.wagers = @{}
    Send-Json $context (Get-FinalWagerState); return
  }

  # "question" = wagers are locked in; "reveal" = answering is over
  if ($path -eq "/api/fw/phase" -and $method -eq "POST") {
    $fw.phase = [string](Read-JsonBody $context).phase
    Send-Json $context (Get-FinalWagerState); return
  }

  # The secret wagers — only this laptop can ask
  if ($path -eq "/api/fw/results" -and $method -eq "GET") {
    Send-Json $context @{ wagers = $fw.wagers }; return
  }

  if ($path -eq "/api/fw/end" -and $method -eq "POST") {
    $fw.active = $false
    Send-Json $context (Get-FinalWagerState); return
  }

  # A phone locks in (or changes) its team's wager, until the question is shown
  if ($path -eq "/api/fw/wager" -and $method -eq "POST") {
    $body = Read-JsonBody $context
    $teamId = [string]$body.teamId
    $accepted = $fw.active -and $fw.phase -eq "wager" -and $fw.maxes.ContainsKey($teamId)
    $amount = 0
    if ($accepted) {
      $amount = [Math]::Max(0, [Math]::Min([int]$fw.maxes[$teamId], [int][Math]::Round([double]$body.amount)))
      $fw.wagers[$teamId] = $amount
    }
    Send-Json $context @{ accepted = [bool]$accepted; amount = $amount; finalWager = (Get-FinalWagerState) }; return
  }

  # --- Fast Money: the game (this laptop) runs it ----------------------
  if ($path -like "/api/fm/*" -and $path -ne "/api/fm/answer" -and -not $request.IsLocal) {
    Send-Text $context "Only the host can do that" 403; return
  }

  # Fast Money begins: the two teams (in order), the questions, the time limit
  if ($path -eq "/api/fm/setup" -and $method -eq "POST") {
    $body = Read-JsonBody $context
    $fm.active = $true
    $fm.teamIds = @($body.teamIds | ForEach-Object { [string]$_ })
    $fm.questions = @($body.questions | ForEach-Object { [string]$_ })
    $fm.seconds = [int]$body.seconds
    $fm.turnTeamId = $null
    $fm.endsAt = @{}
    $fm.finished = @{}
    $fm.answerer = $null
    $fm.answers = @{}
    $fm.taken = @()
    Send-Json $context (Get-FastMoneyState); return
  }

  # The first team's answers (and what they matched), so the second team can't repeat them
  if ($path -eq "/api/fm/taken" -and $method -eq "POST") {
    $fm.taken = @((Read-JsonBody $context).taken)
    Send-Json $context @{ ok = $true }; return
  }

  # A team's turn starts now: their phones show the questions and the clock
  if ($path -eq "/api/fm/start" -and $method -eq "POST") {
    $teamId = [string](Read-JsonBody $context).teamId
    $fm.turnId = $fm.turnId + 1
    $fm.turnTeamId = $teamId
    $fm.endsAt[$teamId] = (Get-Date).AddSeconds($fm.seconds)
    $fm.finished[$teamId] = $false
    $fm.answerer = $null
    $fm.answers[$teamId] = @($fm.questions | ForEach-Object { "" })
    Write-Host ("  FAST MONEY: turn started ({0})" -f (Get-Date -Format "HH:mm:ss")) -ForegroundColor Yellow
    Send-Json $context (Get-FastMoneyState); return
  }

  # The host ends the current turn early
  if ($path -eq "/api/fm/stop" -and $method -eq "POST") {
    if ($fm.turnTeamId) { $fm.endsAt[$fm.turnTeamId] = Get-Date }
    Send-Json $context (Get-FastMoneyState); return
  }

  # Everyone's answers — only this laptop can ask
  if ($path -eq "/api/fm/results" -and $method -eq "GET") {
    Send-Json $context @{ answers = $fm.answers }; return
  }

  # Fast Money is over
  if ($path -eq "/api/fm/end" -and $method -eq "POST") {
    $fm.active = $false
    $fm.turnTeamId = $null
    Send-Json $context (Get-FastMoneyState); return
  }

  # A phone sends one answer (and says when it's finished all five).
  # Only the answering team, only one phone per team, only in time.
  if ($path -eq "/api/fm/answer" -and $method -eq "POST") {
    $body = Read-JsonBody $context
    $teamId = [string]$body.teamId
    $phoneId = [string]$body.playerId
    $index = [int]$body.index
    $inTime = $fm.endsAt.ContainsKey($teamId) -and (Get-Date) -lt $fm.endsAt[$teamId].AddSeconds($FastMoneyGraceSeconds)

    $accepted = $fm.active -and $teamId -eq $fm.turnTeamId -and $inTime -and -not $fm.finished[$teamId] -and
      (-not $fm.answerer -or $fm.answerer -eq $phoneId)
    if ($accepted) {
      $fm.answerer = $phoneId
      if ($index -ge 0 -and $index -lt $fm.answers[$teamId].Count -and $null -ne $body.answer) {
        $text = [string]$body.answer
        $fm.answers[$teamId][$index] = $text.Substring(0, [Math]::Min(60, $text.Length)).Trim()
      }
      if ($body.finished) { $fm.finished[$teamId] = $true }
    }
    Send-Json $context @{ accepted = [bool]$accepted; fastMoney = (Get-FastMoneyState) }; return
  }

  # --- Host screen (the host's phone, with the code) -------------------
  if ($path -eq "/api/host" -and $method -eq "GET") {
    if ($request.QueryString["code"] -ne $HostCode) { Send-Json $context @{ error = "wrong code" } 403; return }
    Send-Json $context @{
      question = $hostQuestion
      locked   = $state.locked
      winner   = $state.winner
    }; return
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
Write-Host "   PANALO! BUZZER IS RUNNING" -ForegroundColor Yellow
Write-Host "  ============================================" -ForegroundColor Magenta
Write-Host "   Host (this laptop):  $hostUrl" -ForegroundColor White
foreach ($url in (Get-JoinUrls)) {
  Write-Host "   Players (phones):    $url" -ForegroundColor Green
}
foreach ($url in (Get-HostUrls)) {
  Write-Host "   Host screen:         $url   (code $HostCode)" -ForegroundColor Cyan
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

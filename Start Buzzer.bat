@echo off
title PANALO! Buzzer
rem Double-click this to start the buzzer server and open the game.
rem Keep the black window open during the game; close it to stop.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0server\buzzer-server.ps1"
pause

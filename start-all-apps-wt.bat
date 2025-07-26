@echo off

REM Check if we're in the correct directory
if not exist "apps" (
    echo Error: Could not find 'apps' directory. 
    echo Please run this script from the root encodly directory.
    pause
    exit /b 1
)

REM Start Windows Terminal with multiple tabs
wt ^
  -p "Command Prompt" -d "%cd%\apps\main-site" --title "Main Site (5000)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\json-formatter" --title "JSON Formatter (5001)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\percentage-calc" --title "Percentage Calc (5002)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\base64-converter" --title "Base64 Converter (5003)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\url-converter" --title "URL Converter (5004)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\jwt-decoder" --title "JWT Decoder (5005)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\jwt-encoder" --title "JWT Encoder (5006)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\hash-generator" --title "Hash Generator (5007)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\uuid-generator" --title "UUID Generator (5008)" cmd /k "npm run dev" ^; ^
  new-tab -p "Command Prompt" -d "%cd%\apps\regex-tester" --title "Regex Tester (5012)" cmd /k "npm run dev"


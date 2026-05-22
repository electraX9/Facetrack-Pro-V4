@echo off
echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║   FaceTrack Pro v4.0  —  First-Time Setup        ║
echo  ╚══════════════════════════════════════════════════╝
echo.

:: Check Node
node --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo  ERROR: Node.js not found.
    echo  Download from https://nodejs.org  ^(LTS version^)
    pause & exit /b 1
)
echo  [OK] Node.js found

:: Install npm packages
echo.
echo  [1/4] Installing packages ^(electron + mediapipe + face-api ~400 MB^)...
call npm install
IF ERRORLEVEL 1 ( echo  npm install failed & pause & exit /b 1 )
echo  [OK] Packages installed

:: Download MediaPipe model files
echo.
echo  [2/4] Downloading MediaPipe models...
if not exist models mkdir models

if not exist "models\face_landmarker.task" (
    powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task' -OutFile 'models\face_landmarker.task' -UseBasicParsing"
    echo  [OK] Face landmark model
) else ( echo  [OK] Face model already downloaded )

if not exist "models\hand_landmarker.task" (
    powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task' -OutFile 'models\hand_landmarker.task' -UseBasicParsing"
    echo  [OK] Hand landmark model
) else ( echo  [OK] Hand model already downloaded )

:: Download face-api.js weights  (NOT included in the npm package)
echo.
echo  [3/4] Downloading face-api.js weights ^(age / gender / emotion^)...
if not exist weights mkdir weights

set FA=https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights

set FILES=tiny_face_detector_model-weights_manifest.json tiny_face_detector_model-shard1 face_expression_model-weights_manifest.json face_expression_model-shard1 age_gender_model-weights_manifest.json age_gender_model-shard1

for %%F in (%FILES%) do (
    if not exist "weights\%%F" (
        powershell -NoProfile -Command "Invoke-WebRequest -Uri '%FA%/%%F' -OutFile 'weights\%%F' -UseBasicParsing"
        if ERRORLEVEL 1 ( echo  WARNING: Could not download %%F ) else ( echo  [OK] %%F )
    ) else ( echo  [OK] %%F already exists )
)

echo.
echo  [4/4] Setup complete!
echo.
echo  ══════════════════════════════════════════
echo   To LAUNCH:    double-click  launch.bat
echo   To BUILD EXE: double-click  build.bat
echo  ══════════════════════════════════════════
echo.
pause

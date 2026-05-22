# AI Face & Hand Tracking System

An advanced AI-powered computer vision application that combines real-time face tracking, hand tracking, object distance detection, and experimental gaze-based scrolling into a single interactive platform. The system uses machine learning and computer vision technologies to analyze facial expressions, estimate age and gender, detect emotions, track hand gestures, and enable virtual drawing through natural movements.

## Features

1. Real-time face detection and tracking
2. Emotion recognition
3. Approximate age prediction
4. Gender detection
5. Real-time hand tracking
6. Virtual drawing using gestures
7. Object distance tracking
8. Experimental gaze scroll system
9. Smooth live camera processing
10. Interactive touch-free controls
11. User calibration system for improved gaze tracking accuracy
    
## Requirements
+Before setup, ensure the following is installed:

**Node.js (latest recommended version)**

## Installation & Setup

1. Clone the Repository
   
(git clone https://github.com/electraX9/Facetrack-Pro-V4.git)

2. Run the Setup File

Open the project folder and run:

```setup.bat```

The setup process will automatically download and install:

+*Electron*
+*MediaPipe*
+*Face API*
+*Required dependencies*
+*AI models and weights for age, gender, and emotion detection*

***First-time setup may require approximately 400MB of downloads.***

## Fixing Vulnerabilities or Errors

If npm reports vulnerabilities or installation issues after setup, open Command Prompt inside the project directory and run:

```npm audit fix --force```

If any remaining errors or vulnerabilities are still detected afterward, run:

```npm audit fix```

These commands will repair and update most dependency issues automatically.

## Launching the Program

After setup is complete, run:

```launch.bat```

The launcher will automatically download the Electron binary package if needed and start the application.

## Building a Standalone Installer

Once everything is working correctly, double-click:

```build.bat```

This will compile a complete standalone Windows installer:

```dist\FaceTrack Pro Setup 4.0.0.exe```

The generated installer contains the full application and can be installed on any Windows 10/11 computer without requiring Node.js, Python, or a browser. The setup file is fully portable and ready for distribution.

## Important Notes

*The gaze scrolling system is currently experimental and may vary depending on lighting conditions, camera quality, and user positioning.
A calibration process is included to accurately measure user placement and improve gaze scroll efficiency and responsiveness.
Age and gender results are AI-based predictions and may not always be 100% accurate. However, the system is designed to provide near-accurate estimations in real time.*

## How It Works

*The application captures live webcam input and processes each frame using AI-powered computer vision models. Facial landmarks are analyzed to estimate age, detect gender, and recognize emotions, while hand tracking enables gesture-based interaction and virtual drawing. The system also includes object distance estimation and an experimental gaze-scroll feature for hands-free navigation.*

License

This project is open-source and intended for educational and research purposes.

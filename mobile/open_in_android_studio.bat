@echo off
REM Open Android Studio with the project
start "" "C:\Users\Lenovo\Desktop\react native+mern\mobile\android"
timeout /t 2
REM Try to find and open Android Studio
for /f "tokens=*" %%A in ('where studio64.exe 2^>nul') do (
    start "" "%%A" "C:\Users\Lenovo\Desktop\react native+mern\mobile\android"
    goto done
)
for /f "tokens=*" %%A in ('dir /s /b "C:\Program Files\Android\Android Studio\bin\studio64.exe" 2^>nul') do (
    start "" "%%A" "C:\Users\Lenovo\Desktop\react native+mern\mobile\android"
    goto done
)
echo Please open Android Studio manually and open this folder: C:\Users\Lenovo\Desktop\react native+mern\mobile\android
:done

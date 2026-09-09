@echo off
echo =======================================================
echo  ☕ Caffera Backend - Build ^& Publish for MonsterASP.NET
echo =======================================================
echo.

echo [1/3] Menghapus folder publish lama...
if exist publish rmdir /s /q publish
if exist publish.zip del /f /q publish.zip

echo [2/3] Membangun dan mempublish proyek (Release Mode - .NET 9)...
dotnet publish Caffera.Backend.csproj -c Release -o ./publish

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Publish gagal! Periksa pesan error di atas.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Mengompresi folder publish menjadi publish.zip...
powershell -Command "Compress-Archive -Path '.\publish\*' -DestinationPath '.\publish.zip' -Force"

echo.
echo =======================================================
echo  SUCCESS! File 'publish.zip' berhasil dibuat.
echo =======================================================
echo  Langkah selanjutnya:
echo  1. Buka File Manager di Control Panel MonsterASP.NET
echo  2. Masuk ke folder 'site/wwwroot' (atau root website Anda)
echo  3. Upload file 'publish.zip'
echo  4. Klik kanan / tombol Unzip / Extract pada publish.zip
echo  5. Selesai! Akses URL website Anda di browser.
echo =======================================================
echo.
pause

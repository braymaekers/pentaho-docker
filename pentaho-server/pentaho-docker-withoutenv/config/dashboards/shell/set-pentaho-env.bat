REM /*!
REM  * HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
REM  *
REM  * Copyright 2002 - 2019 Hitachi Vantara. All rights reserved.
REM  *
REM  * NOTICE: All information including source code contained herein is, and
REM  * remains the sole property of Hitachi Vantara and its licensors. The intellectual
REM  * and technical concepts contained herein are proprietary and confidential
REM  * to, and are trade secrets of Hitachi Vantara and may be covered by U.S. and foreign
REM  * patents, or patents in process, and are protected by trade secret and
REM  * copyright laws. The receipt or possession of this source code and/or related
REM  * information does not convey or imply any rights to reproduce, disclose or
REM  * distribute its contents, or to manufacture, use, or sell anything that it
REM  * may describe, in whole or in part. Any reproduction, modification, distribution,
REM  * or public display of this information without the express written authorization
REM  * from Hitachi Vantara is strictly prohibited and in violation of applicable laws and
REM  * international treaties. Access to the source code contained herein is strictly
REM  * prohibited to anyone except those individuals and entities who have executed
REM  * confidentiality and non-disclosure agreements or other agreements with Hitachi Vantara,
REM  * explicitly covering such access.
REM  */

rem ---------------------------------------------------------------------------
rem Finds a suitable Java
rem
rem Looks in well-known locations to find a suitable Java then sets two 
rem environment variables for use in other bat files. The two environment
rem variables are:
rem 
rem * _PENTAHO_JAVA_HOME - absolute path to Java home
rem * _PENTAHO_JAVA - absolute path to Java launcher (e.g. java.exe)
rem 
rem The order of the search is as follows:
rem 
rem 1. argument #1 - path to Java home
rem 2. environment variable PENTAHO_JAVA_HOME - path to Java home
rem 3. jre folder at current folder level
rem 4. java folder at current folder level
rem 5. jre folder one level up
rem 6. java folder one level up
rem 7. jre folder two levels up
rem 8. java folder two levels up
rem 9. environment variable JAVA_HOME - path to Java home
rem 10. environment variable JRE_HOME - path to Java home
rem 
rem If a suitable Java is found at one of these locations, then 
rem _PENTAHO_JAVA_HOME is set to that location and _PENTAHO_JAVA is set to the 
rem absolute path of the Java launcher at that location. If none of these 
rem locations are suitable, then _PENTAHO_JAVA_HOME is set to empty string and 
rem _PENTAHO_JAVA is set to java.exe.
rem 
rem Finally, there is one final optional environment variable: PENTAHO_JAVA.
rem If set, this value is used in the construction of _PENTAHO_JAVA. If not 
rem set, then the value java.exe is used.
rem
REM START HITACHI VANTARA LICENSE
rem To search for the pentaho license, this script will look into the current
rem for .installedLicenses.xml, one folder up and two folder up. If file is
rem found in any of these location PENTAHO_INSTALLED_LICENSE_PATH is set to that
rem path including the file name
REM END HITACHI VANTARA LICENSE    
rem ---------------------------------------------------------------------------

if not "%PENTAHO_JAVA%" == "" goto gotPentahoJava
set __LAUNCHER=java.exe
goto checkPentahoJavaHome

:gotPentahoJava
set __LAUNCHER=%PENTAHO_JAVA%
goto checkPentahoJavaHome

:checkPentahoJavaHome
if exist "%~1\bin\%__LAUNCHER%" goto gotValueFromCaller
if not "%PENTAHO_JAVA_HOME%" == "" goto gotPentahoJavaHome
if exist "%~dp0jre\bin\%__LAUNCHER%" goto gotJreCurrentFolder
if exist "%~dp0java\bin\%__LAUNCHER%" goto gotJavaCurrentFolder
if exist "%~dp0..\jre\bin\%__LAUNCHER%" goto gotJreOneFolderUp
if exist "%~dp0..\java\bin\%__LAUNCHER%" goto gotJavaOneFolderUp
if exist "%~dp0..\..\jre\bin\%__LAUNCHER%" goto gotJreTwoFolderUp
if exist "%~dp0..\..\java\bin\%__LAUNCHER%" goto gotJavaTwoFolderUp
if not "%JAVA_HOME%" == "" goto gotJdkHome
if not "%JRE_HOME%" == "" goto gotJreHome
goto gotPath

:gotPentahoJavaHome
echo DEBUG: Using PENTAHO_JAVA_HOME
set _PENTAHO_JAVA_HOME=%PENTAHO_JAVA_HOME%
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJreCurrentFolder
echo DEBUG: Found JRE at the current folder
set _PENTAHO_JAVA_HOME=%~dp0jre
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJavaCurrentFolder
echo DEBUG: Found JAVA at the current folder
set _PENTAHO_JAVA_HOME=%~dp0java
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJreOneFolderUp
echo DEBUG: Found JRE one folder up
set _PENTAHO_JAVA_HOME=%~dp0..\jre
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJavaOneFolderUp
echo DEBUG: Found JAVA one folder up
set _PENTAHO_JAVA_HOME=%~dp0..\java
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJreTwoFolderUp
echo DEBUG: Found JRE two folder up
set _PENTAHO_JAVA_HOME=%~dp0..\..\jre
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJavaTwoFolderUp
echo DEBUG: Found JAVA two folder up
set _PENTAHO_JAVA_HOME=%~dp0..\..\java
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJdkHome
echo DEBUG: Using JAVA_HOME
set _PENTAHO_JAVA_HOME=%JAVA_HOME%
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotJreHome
echo DEBUG: Using JRE_HOME
set _PENTAHO_JAVA_HOME=%JRE_HOME%
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotValueFromCaller
echo DEBUG: Using value (%~1) from calling script
set _PENTAHO_JAVA_HOME=%~1
set _PENTAHO_JAVA=%_PENTAHO_JAVA_HOME%\bin\%__LAUNCHER%
goto javaEnd

:gotPath
echo WARNING: Using java from path
set _PENTAHO_JAVA_HOME=
set _PENTAHO_JAVA=%__LAUNCHER%

goto javaEnd

:javaEnd
REM START HITACHI VANTARA LICENSE
if "%PENTAHO_INSTALLED_LICENSE_PATH%" == "" goto findLicensePath
goto licenseEnd

:findLicensePath
if exist "%~dp0.installedLicenses.xml" goto foundLicenseCurrentFolder
if exist "%~dp0..\.installedLicenses.xml" goto foundLicenseOneFolderUp
if exist "%~dp0..\..\.installedLicenses.xml" goto foundLicenseTwoFoldersUp
goto licenseEnd

:foundLicenseCurrentFolder:
echo DEBUG: Found Pentaho License at the current folder
set PENTAHO_INSTALLED_LICENSE_PATH=%~dp0.installedLicenses.xml
goto licenseEnd

:foundLicenseOneFolderUp:
echo DEBUG: Found Pentaho License one folder up
set PENTAHO_INSTALLED_LICENSE_PATH=%~dp0..\.installedLicenses.xml
goto licenseEnd

:foundLicenseTwoFoldersUp:
echo DEBUG: Found Pentaho License two folders up
set PENTAHO_INSTALLED_LICENSE_PATH=%~dp0..\..\.installedLicenses.xml
goto licenseEnd

:licenseEnd
echo DEBUG: _PENTAHO_JAVA_HOME=%_PENTAHO_JAVA_HOME%
echo DEBUG: _PENTAHO_JAVA=%_PENTAHO_JAVA%
echo DEBUG: PENTAHO_INSTALLED_LICENSE_PATH=%PENTAHO_INSTALLED_LICENSE_PATH%
REM END HITACHI VANTARA LICENSE
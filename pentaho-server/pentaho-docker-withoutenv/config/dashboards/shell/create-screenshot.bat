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

setlocal EnableDelayedExpansion

set IS64BITJAVA=0

call "%~dp0set-pentaho-env.bat"

REM **************************************************
REM   Platform Specific SWT       **
REM **************************************************

REM The following line is predicated on the 64-bit Sun
REM java output from -version which
REM looks like this (at the time of this writing):
REM
REM java version "1.6.0_17"
REM Java(TM) SE Runtime Environment (build 1.6.0_17-b04)
REM Java HotSpot(TM) 64-Bit Server VM (build 14.3-b01, mixed mode)
REM
REM Below is a logic to find the directory where java can found. We will
REM temporarily change the directory to that folder where we can run java there
pushd "%_PENTAHO_JAVA_HOME%"
if exist java.exe goto USEJAVAFROMPENTAHOJAVAHOME
cd bin
if exist java.exe goto USEJAVAFROMPENTAHOJAVAHOME
popd
pushd "%_PENTAHO_JAVA_HOME%\jre\bin"
if exist java.exe goto USEJAVAFROMPATH
goto USEJAVAFROMPATH
:USEJAVAFROMPENTAHOJAVAHOME
FOR /F %%a IN ('.\java.exe -version 2^>^&1^|%windir%\system32\find /C "64-Bit"') DO (SET /a IS64BITJAVA=%%a)
GOTO CHECK32VS64BITJAVA
:USEJAVAFROMPATH
FOR /F %%a IN ('java -version 2^>^&1^|find /C "64-Bit"') DO (SET /a IS64BITJAVA=%%a)
GOTO CHECK32VS64BITJAVA
:CHECK32VS64BITJAVA

IF %IS64BITJAVA% == 1 GOTO :USE64

:USE32
REM ===========================================
REM Using 32bit Java, so include 32bit SWT Jar
REM ===========================================
set LIBPATH=..\libswt\win32
set XULRUNNER=..\xulrunner\win32
GOTO :CONTINUE
:USE64
REM ===========================================
REM Using 64bit java, so include 64bit SWT Jar
REM ===========================================
set LIBPATH=..\libswt\win64
:CONTINUE
popd

REM ******************************************************************
REM ** Set java runtime options                                     **
REM ** Change 512m to higher values in case you run out of memory   **
REM ** or set the PENTAHO_DI_JAVA_OPTIONS environment variable      **
REM ******************************************************************

if "%JAVA_OPTIONS%"=="" set JAVA_OPTIONS="-Xmx512m" "-XX:MaxPermSize=256m"

set OPT=%JAVA_OPTIONS% "-Djava.library.path=%LIBSPATH%" "-Dorg.eclipse.swt.browser.XULRunnerPath=$XULRUNNER"

REM ***************
REM ** Run...    **
REM ***************

set CLASSPATH="%LIBPATH%\swt.jar
for /R ..\lib %%a in (*.jar) do (
  set CLASSPATH=!CLASSPATH!;%%a
)
set CLASSPATH=!CLASSPATH!"
echo !CLASSPATH!

@echo on
"%_PENTAHO_JAVA%" -cp %CLASSPATH% %OPT% org.pentaho.dashboards.content.printing.SwtScreenshotCreatorCommand width %1 height %2 url %3 outputfile %4 browser %5 authurl %AUTHURL% 2> %ERRORFILE%
set error_level=%ERRORLEVEL%
exit %ERRORLEVEL%

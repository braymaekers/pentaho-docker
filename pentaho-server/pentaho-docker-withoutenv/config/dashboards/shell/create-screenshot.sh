#!/bin/sh
#/*!
# * HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
# *
# * Copyright 2002 - 2019 Hitachi Vantara. All rights reserved.
# *
# * NOTICE: All information including source code contained herein is, and
# * remains the sole property of Hitachi Vantara and its licensors. The intellectual
# * and technical concepts contained herein are proprietary and confidential
# * to, and are trade secrets of Hitachi Vantara and may be covered by U.S. and foreign
# * patents, or patents in process, and are protected by trade secret and
# * copyright laws. The receipt or possession of this source code and/or related
# * information does not convey or imply any rights to reproduce, disclose or
# * distribute its contents, or to manufacture, use, or sell anything that it
# * may describe, in whole or in part. Any reproduction, modification, distribution,
# * or public display of this information without the express written authorization
# * from Hitachi Vantara is strictly prohibited and in violation of applicable laws and
# * international treaties. Access to the source code contained herein is strictly
# * prohibited to anyone except those individuals and entities who have executed
# * confidentiality and non-disclosure agreements or other agreements with Hitachi Vantara,
# * explicitly covering such access.
# */

# **************************************************
# ** Set these to the location of your mozilla
# ** installation directory.  Use a Mozilla with
# ** Gtk2 and Fte enabled.
# **************************************************

# set MOZILLA_FIVE_HOME=/usr/local/mozilla
# set LD_LIBRARY_PATH=/usr/local/mozilla

# Try to guess xulrunner location - change this if you need to
#MOZILLA_FIVE_HOME=$(find /usr/lib -maxdepth 1 -name xulrunner-[0-9]* | head -1)
#LD_LIBRARY_PATH=${MOZILLA_FIVE_HOME}:${LD_LIBRARY_PATH}
#export MOZILLA_FIVE_HOME LD_LIBRARY_PATH

# Fix for GTK Windows issues with SWT
export GDK_NATIVE_WINDOWS=1

# Fix overlay scrollbar bug with Ubuntu 11.04
export LIBOVERLAY_SCROLLBAR=0

# **************************************************
# ** Init BASEDIR                                 **
# **************************************************
BASEDIR=`dirname "$0"`
cd $BASEDIR
DIR=`pwd`
cd -

. "$DIR/set-pentaho-env.sh"

setPentahoEnv

# **************************************************
# ** Platform specific libraries ...              **
# **************************************************

case `uname -s` in
  Darwin)
    ARCH=`uname -m`
  OPT="-XstartOnFirstThread $OPT"
  case $ARCH in
    x86_64)
      if $($_PENTAHO_JAVA -version 2>&1 | grep "64-Bit" > /dev/null )
                            then
        LIBPATH=$BASEDIR/../libswt/osx64/
        XULRUNNER=$BASEDIR/../xulrunner/osx64
                            else
        echo "I'm sorry, this Mac platform [$ARCH] is not yet supported!"
        echo "Please try starting using 'Data Integration 32-bit' or"
        echo "'Data Integration 64-bit' as appropriate."
        exit
                            fi
      ;;

    *)
      echo "I'm sorry, this Mac platform [$ARCH] is not yet supported!"
      echo "Please try starting using 'Data Integration 32-bit' or"
      echo "'Data Integration 64-bit' as appropriate."
      exit
      ;;
  esac
  ;;


  Linux)
      ARCH=`uname -m`
    case $ARCH in
      x86_64)
        if $($_PENTAHO_JAVA -version 2>&1 | grep "64-Bit" > /dev/null )
                                then
          LIBPATH=$BASEDIR/../libswt/linux/x86_64/
          XULRUNNER=xulrunner/linux/x86_64
                                else
          LIBPATH=$BASEDIR/../libswt/linux/x86/
          XULRUNNER=xulrunner/linux/x86
                                fi
        ;;

      i[3-6]86)
        LIBPATH=$BASEDIR/../libswt/linux/x86/
        XULRUNNER=xulrunner/linux/x86
        ;;

      *)
        echo "I'm sorry, this Linux platform [$ARCH] is not yet supported!"
        exit
        ;;
    esac
    ;;

  CYGWIN*)
    ./Spoon.bat
    exit
    ;;

  *)
    echo Spoon is not supported on this hosttype : `uname -s`
    exit
    ;;
esac

CLASSPATH=${LIBPATH}swt.jar

for i in ../lib/*.jar; do
  CLASSPATH=$CLASSPATH:$i
done

echo "classpath:"
echo $CLASSPATH

#silly but we need the full path to xulrunner, can't have .. or so in the path.
XULRUNNER=$(dirname "$(readlink -f ".")")/$XULRUNNER
echo "xulrunner:"
echo $XULRUNNER
#http://www.eclipse.org/swt/faq.php#specifyxulrunner

#Use the following line to "let swt figure it out" (recommended)
$_PENTAHO_JAVA $OPT -classpath "$CLASSPATH" org.pentaho.dashboards.content.printing.SwtScreenshotCreatorCommand width $1 height $2 url $3 outputfile "$OUTPUTFILE" browser $5 authurl $6

#Use the following line to specify the xulrunner path explicitly (used for mozilla browser)
#$_PENTAHO_JAVA -classpath "$CLASSPATH" -Dorg.eclipse.swt.browser.XULRunnerPath=$XULRUNNER -Djava.library.path=$LIBPATH org.pentaho.dashboards.content.printing.SwtScreenshotCreatorCommand width $1 height $2 url $3 outputfile $4 browser $5 authurl $6

#Use the following line to force the WEBKIT browser (even on swt 3.6)
#$_PENTAHO_JAVA -classpath "$CLASSPATH" -Dorg.eclipse.swt.browser.UseWebKitGTK=true org.pentaho.dashboards.content.printing.SwtScreenshotCreatorCommand width $1 height $2 url $3 outputfile $4 browser $5 authurl $6

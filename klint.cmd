@echo off
IF "%1"=="nofilter" (GOTO :nofilter) 

echo Hint, Run klint "nofilter" to see errors without filtering
docker run -v %CD%\deploy:/dir -v %CD%\.kube-linter.yaml:/etc/config.yaml stackrox/kube-linter lint /dir --config /etc/config.yaml
goto :done 

:nofilter
docker run -v %CD%\deploy:/dir -v %CD%\.kube-linter.yaml:/etc/config.yaml stackrox/kube-linter lint /dir  

:done




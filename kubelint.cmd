@echo off
IF "%1."=="." (GOTO :usage) 
set LINT=/dir/%1
IF "%2."=="." (GOTO :nofilter)  
set FILTER=--config /dir/%2 

echo %LINT%

:run 
echo docker run -v %CD%:/dir stackrox/kube-linter lint %LINT%  %FILTER%
docker run -v %CD%:/dir stackrox/kube-linter lint %LINT%  %FILTER%
goto :done 

:nofilter
set FILTER=
goto :run

:usage
echo Usage kubelint directory [filter-file]
:done




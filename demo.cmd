echo.
echo Deployment Scan with filtering
type kube-linter.yaml
echo.
call kubelint deploy kube-linter.yaml
echo.
echo Deployment Scan with no filtering
call kubelint deploy   
call kubelint deploy 2>klint.txt 
echo "run sarif generator "
node kubelinter2sarif klint.txt output.sarif
rem hack to remote docker directory "/dir/"
sed s/\/dir\///g output.sarif >tmp.sarif
jq . tmp.sarif  > output.sarif
del tmp.sarif 
 

echo Helm Chart Scan with no filtering
call kubelint actions-runner   
call kubelint actions-runner 2>helm.txt 
node kubelinter2sarif helm.txt helm.sarif 
rem hack to remote docker directory "/dir/"
sed s/\/dir\///g helm.sarif >tmp.sarif
jq . tmp.sarif  > helm.sarif
del tmp.sarif 

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
node convert.js klint.txt output.sarif
 
jq . output.sarif  > tmp.sarif
copy tmp.sarif output.sarif
del tmp.sarif 

echo Helm Chart Scan with no filtering
call kubelint actions-runner   
call kubelint actions-runner 2>helm.txt 
node convert.js helm.txt helm.sarif 
jq . helm.sarif  > tmp.sarif
copy tmp.sarif helm.sarif
del tmp.sarif 

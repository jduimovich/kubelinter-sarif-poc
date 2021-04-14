 
echo with filtering
cat kube-linter.yaml
sh kubelint.sh deploy kube-linter.yaml
echo with no filtering
sh kubelint.sh deploy kube-linter.yaml 
sh kubelint.sh deploy kube-linter.yaml 2>klint.txt 
echo "run sarif generator "
node convert.js klint.txt output.sarif 
jq . output.sarif > tmp.sarif
mv tmp.sarif output.sarif

echo Helm Chart Scan with no filtering
sh kubelint.sh actions-runner   
sh kubelint.sh actions-runner   2>helm.txt 
node convert.js helm.txt helm.sarif 
jq . helm.sarif  > tmp.sarif
mv tmp.sarif helm.sarif 





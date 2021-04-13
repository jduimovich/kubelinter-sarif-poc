 
echo with filtering
cat .kube-linter.yaml
 
sh klint.sh
 
echo with no filtering
sh klint.sh nofilter

sh klint.sh nofilter 2>klint.txt 
echo "run sarif generator "
node convert.js klint.txt

jq . output.sarif


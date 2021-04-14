 
echo with filtering
cat kube-linter.yaml
  
docker run -v $(PWD)/deploy:/dir -v $(PWD)/.kube-linter.yaml:/etc/config.yaml stackrox/kube-linter lint /dir --config /etc/config.yaml
 
echo with no filtering
docker run -v $(PWD)/deploy:/dir -v $(PWD)/.kube-linter.yaml:/etc/config.yaml stackrox/kube-linter lint /dir

docker run -v $(PWD)/deploy:/dir -v $(PWD)/.kube-linter.yaml:/etc/config.yaml stackrox/kube-linter lint /dir
 2>klint.txt 
echo "run sarif generator "
node convert.js klint.txt

jq . output.sarif > tmp.sarif
mv tmp.sarif output.sarif




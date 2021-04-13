 
if [ "$1" == "nofilter" ]
then
docker run -v $(PWD)/deploy:/dir -v $(PWD)/.kube-linter.yaml:/etc/config.yaml stackrox/kube-linter lint /dir
else
echo Hint, Run klint "nofilter" to see errors without filtering
docker run -v $(PWD)/deploy:/dir -v $(PWD)/.kube-linter.yaml:/etc/config.yaml stackrox/kube-linter lint /dir --config /etc/config.yaml
fi
 


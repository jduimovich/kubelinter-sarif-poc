if [ "$1" == "" ]
then
echo usage kubelint directory [filter]
exit
fi
export LINT=$1

if [ "$2" == "" ]
then 
set FILTER=
else  
export FILTER="--config $2"
export DFILTER="--config /dir/$2"
fi 
if [ "$3" == "docker" ]
then
echo docker run -v $(PWD):/dir stackrox/kube-linter lint /dir/$LINT  $DFILTER
docker run -v $(PWD):/dir stackrox/kube-linter lint /dir/$LINT  $DFILTER
else 
echo kube-linter lint $LINT  $FILTER 
kube-linter lint $LINT  $FILTER 
fi


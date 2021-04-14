if [ "$1" == "" ]
then
echo usage kubelint directory [filter]
exit
fi
export LINT=/dir/$1

if [ "$2" == "" ]
then
echo no filter
set FILTER=
else 
echo filter is $2
export FILTER="--config /dir/$2"
fi
echo kublint $LINT $FILTER
docker run -v $(PWD):/dir stackrox/kube-linter lint $LINT  $FILTER


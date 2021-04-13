echo.
echo with filtering
type .kube-linter.yaml
echo.
call klint.cmd
echo.
echo with no filtering
call klint.cmd nofilter

call klint.cmd nofilter 2>klint.txt 
echo "run sarif generator "
node convert.js klint.txt

jq . output.sarif

"# kubelinter-sarif-poc" 

This demo uses kubelinter to detect errors in deployment manifests.
This output is parsed and converted to json / sarif format for use in IDE and Github Actions tools 

To run the demo use
```
sh demo.sh
```

or `demo.cmd` on Windows.

The converted output can be found in output.sarif, the original raw output in klint.txt.
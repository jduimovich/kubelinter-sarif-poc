# kubelinter-sarif-poc

This demo uses kubelinter to detect errors in deployment manifests.
This output is parsed and converted to json / sarif format for use in IDEs and Github Actions Integrations 

To run the demo use
```
sh demo.sh
```

or `demo.cmd` on Windows.

The demo scans two types of yaml.
The first is a deployment, with multiple yaml files.
The converted output can be found in output.sarif, the original raw output in klint.txt.


The secons is a helm chart directory. The output can be found in helm.sarif 



You can view the sarif file in many ways

1. Github Security Tab if uploaded to github via the code-ql action. 

2. The VSCode Plugin [https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer](https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer)

3. A web based viewer  [https://microsoft.github.io/sarif-web-component/](https://microsoft.github.io/sarif-web-component/)

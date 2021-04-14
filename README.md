# kubelinter-sarif-poc

This demo uses kubelinter to detect errors in deployment manifests.
The output from kubelinter is unstructured so this demo uses a node application to convert to a basic SARIF format.

This output can be used used in IDEs and Github Actions Integrations 

There is a version of this script integrated into github action is here https://github.com/jduimovich/kube-linter-action forked from the original stackrox action. This repo uses this action and will have some security scan issues found in this repo. To use this yourself, fork this repo, and run the action manually from the actions tab. 

```
name: Lint  Requests    
on: [push, workflow_dispatch]
jobs:    
  lint:
    name: Run Kube-Linter and output json sarif file
    runs-on: ubuntu-20.04 
    steps:
      - uses: actions/checkout@v2
      - name: Lint Repository 
        uses: jduimovich/kube-linter-action@main
        with:
          directory: deploy    
          outputFile: kube-linter.sarif
      - name: Show sarif
        run: |  
          cat kube-linter.sarif
      - name: Upload result to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v1
        with:
          sarif_file: kube-linter.sarif
```
Output will look like this 
![image](https://user-images.githubusercontent.com/7844190/114768519-f63e3980-9d36-11eb-987a-d40cdeea56ea.png)



To see the standalone use cases, run `sh demo.sh` or `demo.cmd` on Windows. This can be used to do development.

The demo scans two types of yaml.

The first is a deployment, with multiple yaml files under the deploy/ directory and the output will be in output.sarif.
The second scan is a helm chart directory. The output can be found in helm.sarif 

You can view the sarif file in a few ways. 

1. Github Security Tab if uploaded to github via the code-ql action. 

2. The VSCode Plugin [https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer](https://marketplace.visualstudio.com/items?itemName=MS-SarifVSCode.sarif-viewer)

3. A web based viewer  [https://microsoft.github.io/sarif-web-component/](https://microsoft.github.io/sarif-web-component/)

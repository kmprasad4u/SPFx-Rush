## SPFx-Rush
Using Rush with SPFx projects

### Installing Packages (one of below commands)
> rush update [--full]

### Bundling & Creating SPFx Packages
> rush package

### Building the code
> rush build

### Serving
Change Site Url in src\SPFx-WebPart\Config\serve.json
* In Termainal 1
    * cd packages\SPFx-Library
    * npm run serve
* In Terminal 2
    * cd packages\SPFx-WebPart
    * npm run serve

### Configurations
* rush.json
* common\config\command-line.json
* scripts section in "packages\<package>\package.json"

### References
* https://www.vrdmn.com/2019/04/using-microsoft-rush-to-manage-spfx.html
* https://rushjs.io/pages/intro/get_started/